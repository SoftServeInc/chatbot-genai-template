data "google_dns_managed_zone" "primary" {
  count = local.dns_zone_name != "" ? 1 : 0
  name  = local.dns_zone_name
}

resource "google_project_service" "certificate_manager" {
  count   = local.gcm_domain_name != "" ? 1 : 0
  service = "certificatemanager.googleapis.com"

  # services that are enabled and which depend on this service should also be disabled when this service is destroyed
  disable_dependent_services = true

  # do not disable the API when this resource is destroyed
  disable_on_destroy = false
}

// Configure DNS authorization to provide the ACME challenge DNS records (https://letsencrypt.org/docs/challenge-types/#dns-01-challenge)
// A DnsAuthorization resource covers a single domain and its wildcard subdomains.
resource "google_certificate_manager_dns_authorization" "this" {
  count       = local.gcm_domain_name != "" ? 1 : 0
  domain      = local.gcm_domain_name
  name        = local.resource_basename
  description = "DNS authorization for ${local.gcm_domain_name} to support wildcard certificates"

  depends_on = [
    google_project_service.certificate_manager
  ]
}

// Provision a wildcard managed SSL certificate using DNS authorization
resource "google_certificate_manager_certificate" "this" {
  count       = local.gcm_domain_name != "" ? 1 : 0
  name        = local.resource_basename
  description = "Wildcard certificate for ${local.gcm_domain_name} and sub-domains"

  managed {
    domains = [local.gcm_domain_name, "*.${local.gcm_domain_name}"]

    dns_authorizations = [
      google_certificate_manager_dns_authorization.this[0].id
    ]
  }
}

// DNS authorization record
resource "google_dns_record_set" "gcm_cerificate_authorization" {
  count        = local.gcm_domain_name != "" ? 1 : 0
  managed_zone = local.dns_zone_name
  ttl          = 300
  name         = google_certificate_manager_dns_authorization.this[0].dns_resource_record[0].name
  type         = google_certificate_manager_dns_authorization.this[0].dns_resource_record[0].type

  rrdatas = [
    google_certificate_manager_dns_authorization.this[0].dns_resource_record[0].data
  ]

  lifecycle {
    precondition {
      condition     = endswith(local.gcm_domain_name, local.dns_zone_domain)
      error_message = "The certificate domain name must be a subdomain of the DNS zone name"
    }
  }
}
