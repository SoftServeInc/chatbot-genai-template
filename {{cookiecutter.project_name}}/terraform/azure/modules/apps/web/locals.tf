locals {
  region = var.region

  env     = var.env
  app     = "web"
  project = var.project

  project_resource_group_name            = var.project_resource_group_name
  project_storage_account_name           = var.project_storage_account_name
  project_storage_tfstate_container_name = var.project_storage_tfstate_container_name

  resource_group_name = data.terraform_remote_state.common.outputs.resource_group_name
  key_vault_id        = data.terraform_remote_state.common.outputs.key_vault_id

  resource_basename    = "${local.project}-${local.env}"
  storage_account_name = lower(replace("${local.resource_basename}-${local.app}", "-", ""))

  dns_zone_name  = var.dns_zone_name
  domain_name    = var.domain_name
  subdomain_name = local.dns_zone_name == "" || local.domain_name == "" || length(local.dns_zone_name) > length(local.domain_name) ? "" : substr(local.domain_name, 0, length(local.domain_name) - length(local.dns_zone_name) - 1)

  cdn_profile_name  = "cdn-${local.resource_basename}-${local.app}"
  cdn_endpoint_name = "${local.resource_basename}-${local.app}"
}
