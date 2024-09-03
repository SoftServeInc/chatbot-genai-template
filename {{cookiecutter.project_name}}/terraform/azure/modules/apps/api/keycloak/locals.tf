locals {
  region = var.region

  app     = "keycloak"
  env     = var.env
  project = var.project

  resource_basename   = "${local.project}-${local.env}"
  resource_group_name = var.resource_group_name

  dns_zone_name                = var.dns_zone_name
  dns_zone_resource_group_name = var.dns_zone_resource_group_name

  managed_certificate_name = "mc-${local.resource_basename}-${local.app}"

  container_app_name           = "ca-${local.resource_basename}-${local.app}"
  container_app_environment_id = var.container_app_environment_id

  domain_name    = var.hostname
  subdomain_name = local.dns_zone_name == "" || local.domain_name == "" ? "" : substr(local.domain_name, 0, length(local.domain_name) - length(local.dns_zone_name) - 1)

  hostname = var.hostname

  # Ensure that the hostname_path does not end with a slash but starts with one
  hostname_path_ = endswith(var.hostname_path, "/") ? substr(var.hostname_path, 0, length(var.hostname_path) - 1) : var.hostname_path
  hostname_path  = local.hostname_path_ != "" && !startswith(local.hostname_path_, "/") ? "/${local.hostname_path_}" : local.hostname_path_

  api_client_id = "api-server"
  realm_name    = "app"

  tags = {
    project          = local.project
    environment      = local.env
    infrastructure   = "terraform"
    terraform-module = "apps/api/keycloak"
  }
}
