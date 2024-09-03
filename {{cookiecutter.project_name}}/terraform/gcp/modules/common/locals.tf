locals {
  region         = var.region
  project_id     = data.google_project.current.project_id
  project_number = data.google_project.current.number

  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  docker_repository_name = local.resource_basename

  dns_zone_name   = var.dns_zone_name
  dns_zone_domain = var.dns_zone_name != "" ? trimsuffix(data.google_dns_managed_zone.primary[0].dns_name, ".") : ""
  gcm_domain_name = var.dns_zone_name != "" ? var.gcm_domain_name : ""
}
