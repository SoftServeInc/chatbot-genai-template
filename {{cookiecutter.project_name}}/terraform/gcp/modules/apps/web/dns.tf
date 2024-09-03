data "google_dns_managed_zone" "primary" {
  count = local.dns_zone_name != "" ? 1 : 0
  name  = local.dns_zone_name
}

resource "google_dns_record_set" "this" {
  count        = local.dns_zone_name != "" && local.domain_name != "" ? 1 : 0
  managed_zone = local.dns_zone_name
  ttl          = 300
  name         = "${local.domain_name}."
  type         = "A"
  rrdatas      = [google_compute_global_address.this.address]
}
