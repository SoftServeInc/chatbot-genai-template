locals {
  region = var.region

  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  resource_group_name            = "rg-${local.resource_basename}"
  log_analytics_workspace_name   = "log-${local.resource_basename}"
  container_app_environment_name = "cae-${local.resource_basename}"
  key_vault_name                 = "kv-${local.resource_basename}"

  acr_name = replace(local.resource_basename, "-", "") # ACR names must be lowercase and can contain only alphanumeric characters.
}
