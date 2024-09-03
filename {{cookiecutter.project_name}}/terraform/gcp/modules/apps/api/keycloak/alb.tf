resource "google_compute_region_network_endpoint_group" "this" {
  name   = "${local.run_name}-neg"
  region = local.region

  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_v2_service.this.name
  }
}

resource "google_compute_backend_service" "this" {
  name        = "${local.run_name}-service"
  description = "Backend service routing requests to Cloud Run [keycloak] service"
  protocol    = "HTTP"
  port_name   = "http"

  backend {
    group = google_compute_region_network_endpoint_group.this.id
  }
}
