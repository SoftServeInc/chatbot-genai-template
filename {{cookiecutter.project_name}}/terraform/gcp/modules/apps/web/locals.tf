locals {
  region         = var.region
  project_id     = data.google_project.current.project_id
  project_number = data.google_project.current.number

  app     = "web"
  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  bucket_name     = "${local.resource_basename}-${local.app}"
  bucket_location = "US"

  dns_zone_name   = var.dns_zone_name
  dns_zone_domain = var.dns_zone_name != "" ? trimsuffix(data.google_dns_managed_zone.primary[0].dns_name, ".") : ""
  domain_name     = var.domain_name
  enable_https    = local.domain_name != ""

  common_gcm_domain_name    = data.terraform_remote_state.common.outputs.gcm_domain_name
  common_gcm_certificate_id = data.terraform_remote_state.common.outputs.gcm_certificate_id
  custom_gcm_certificate_id = var.gcm_certificate_id
  gcm_certificate_id        = local.domain_name == "" ? "" : (local.custom_gcm_certificate_id == "" ? local.common_gcm_certificate_id : local.custom_gcm_certificate_id)

  cache_default_ttl = var.cache_default_ttl
  cache_max_ttl     = var.cache_max_ttl

  static_paths = ["/index.html", "/404.html", "/favicon.ico", "/robots.txt", "/assets/*", "/static/*"]
}
