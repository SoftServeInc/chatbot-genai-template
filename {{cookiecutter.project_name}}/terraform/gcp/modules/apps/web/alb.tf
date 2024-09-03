resource "google_compute_global_address" "this" {
  name = local.bucket_name
}

resource "google_compute_region_network_endpoint_group" "gcf" {
  name   = "${local.bucket_name}-gcf-nag"
  region = local.region

  network_endpoint_type = "SERVERLESS"

  cloud_function {
    function = google_cloudfunctions2_function.index.name
  }
}

resource "google_compute_backend_service" "gcf" {
  name        = "${local.bucket_name}-gcf-service"
  description = "Backend service routing requests to Cloud Function to serve index.html"
  protocol    = "HTTP"
  port_name   = "http"

  backend {
    group = google_compute_region_network_endpoint_group.gcf.id
  }
}

resource "google_compute_backend_bucket" "gcs" {
  name        = "${local.bucket_name}-gcs-bucket"
  description = "Static content bucket"
  bucket_name = google_storage_bucket.this.name
  enable_cdn  = true

  cdn_policy {
    default_ttl = local.cache_default_ttl
    max_ttl     = local.cache_max_ttl
  }
}

resource "google_compute_url_map" "https" {
  count = local.enable_https ? 1 : 0
  name  = "${local.bucket_name}-https"

  default_service = google_compute_backend_service.gcf.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name = "allpaths"

    # When path does not match the static content, serve index.html from the Cloud Function
    default_service = google_compute_backend_service.gcf.id

    # Serve static content from the GCS bucket
    path_rule {
      paths   = local.static_paths
      service = google_compute_backend_bucket.gcs.id
    }
  }
}

resource "google_compute_url_map" "http" {
  count = local.enable_https ? 0 : 1
  name  = "${local.bucket_name}-http"

  default_service = google_compute_backend_service.gcf.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_service.gcf.id

    path_rule {
      paths   = local.static_paths
      service = google_compute_backend_bucket.gcs.id
    }
  }
}

resource "google_compute_url_map" "http_to_https" {
  count = local.enable_https ? 1 : 0
  name  = "${local.bucket_name}-http-to-https"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_certificate_manager_certificate_map" "this" {
  count = local.enable_https ? 1 : 0
  name  = local.bucket_name

  lifecycle {
    precondition {
      # if domain_name specified the gcm_certificate_id must be specified as well (or pulled from the common state)
      condition     = local.gcm_certificate_id != ""
      error_message = "When domain_name is specified then gcm_certificate_id must be specified as well (or pulled from the common state)"
    }
    precondition {
      # if domain_name specified but custom_gcm_certificate_id is empty, then it means that the common certificate is going to be used for the https://domain_name and that is why the domain_name must be a subdomain of the common certificate domain name
      condition     = local.custom_gcm_certificate_id != "" || endswith(local.domain_name, local.common_gcm_domain_name)
      error_message = "When domain_name is specified, but custom_gcm_certificate_id is not explicitly specified (that's why the common certificate is going to be used) then the domain_name must be a subdomain of the gcm_domain_name from the common state"
    }
  }
}

resource "google_certificate_manager_certificate_map_entry" "this" {
  count        = local.enable_https ? 1 : 0
  name         = local.bucket_name
  map          = google_certificate_manager_certificate_map.this[0].name
  hostname     = local.domain_name
  certificates = [local.gcm_certificate_id]
}

resource "google_compute_target_https_proxy" "https" {
  count   = local.enable_https ? 1 : 0
  name    = "${local.bucket_name}-proxy-https"
  url_map = google_compute_url_map.https[0].id

  certificate_map = "https://certificatemanager.googleapis.com/v1/${google_certificate_manager_certificate_map.this[0].id}"
}

resource "google_compute_target_http_proxy" "http_to_https" {
  count   = local.enable_https ? 1 : 0
  name    = "${local.bucket_name}-proxy-http-to-https"
  url_map = google_compute_url_map.http_to_https[0].id
}

resource "google_compute_target_http_proxy" "http" {
  count   = local.enable_https ? 0 : 1
  name    = "${local.bucket_name}-proxy-http"
  url_map = google_compute_url_map.http[0].id
}

resource "google_compute_global_forwarding_rule" "https" {
  count       = local.enable_https ? 1 : 0
  name        = "${local.bucket_name}-forward-https"
  ip_address  = google_compute_global_address.this.address
  target      = google_compute_target_https_proxy.https[0].id
  ip_protocol = "TCP"
  port_range  = "443"

  load_balancing_scheme = "EXTERNAL"
}

resource "google_compute_global_forwarding_rule" "http_to_https" {
  count       = local.enable_https ? 1 : 0
  name        = "${local.bucket_name}-forward-http-to-https"
  ip_address  = google_compute_global_address.this.address
  target      = google_compute_target_http_proxy.http_to_https[0].id
  ip_protocol = "TCP"
  port_range  = "80"

  load_balancing_scheme = "EXTERNAL"
}

resource "google_compute_global_forwarding_rule" "http" {
  count       = local.enable_https ? 0 : 1
  name        = "${local.bucket_name}-forward-http"
  ip_address  = google_compute_global_address.this.address
  target      = google_compute_target_http_proxy.http[0].id
  ip_protocol = "TCP"
  port_range  = "80"

  load_balancing_scheme = "EXTERNAL"
}
