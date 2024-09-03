locals {
  region     = var.region
  account_id = var.account_id

  app     = "keycloak"
  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

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
