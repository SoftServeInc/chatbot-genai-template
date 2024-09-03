locals {
  region = var.region

  app     = "api"
  env     = var.env
  project = var.project

  project_resource_group_name            = var.project_resource_group_name
  project_storage_account_name           = var.project_storage_account_name
  project_storage_tfstate_container_name = var.project_storage_tfstate_container_name

  db_name            = var.db_name
  db_port            = 5432
  db_sku_name        = var.db_sku_name
  db_username        = "postgres"
  db_is_public       = var.db_is_public
  db_enable_pgvector = var.db_enable_pgvector

  resource_group_name          = data.terraform_remote_state.common.outputs.resource_group_name
  container_app_environment_id = data.terraform_remote_state.common.outputs.container_app_environment_id
  key_vault_id                 = data.terraform_remote_state.common.outputs.key_vault_id

  resource_basename = "${local.project}-${local.env}"

  postgresql_server_name = "pg-${local.resource_basename}-${local.app}"

  acr_server      = data.terraform_remote_state.common.outputs.acr_server
  acr_credentials = data.terraform_remote_state.common.outputs.acr_admin_credentials

  dns_zone_name  = var.dns_zone_name
  domain_name    = var.domain_name
  subdomain_name = local.dns_zone_name == "" || local.domain_name == "" ? "" : substr(local.domain_name, 0, length(local.domain_name) - length(local.dns_zone_name) - 1)

  managed_certificate_name = "mc-${local.resource_basename}-${local.app}"

  container_app_name                = "ca-${local.resource_basename}-${local.app}"
  container_app_image               = "${local.acr_server}/{% if cookiecutter.__monorepo %}api{% else %}main{% endif %}:${var.image_tag}"
  container_app_server_cpu          = var.container_app_server_cpu
  container_app_server_memory       = var.container_app_server_memory
  container_app_server_min_replicas = var.container_app_server_min_replicas
  container_app_server_max_replicas = var.container_app_server_max_replicas

  {%- if cookiecutter.auth == "keycloak" %}

  container_app_keycloak_cpu    = var.container_app_keycloak_cpu
  container_app_keycloak_memory = var.container_app_keycloak_memory
  keycloak_image_tag            = var.keycloak_image_tag
  keycloak_hostname             = var.keycloak_hostname
  keycloak_basepath             = var.keycloak_basepath

  {%- endif %}

  container_app_envs = [
    for k, v in var.container_app_env_vars : {
      name  = k
      value = v
    } if !startswith(v, "SECRET:")
  ]

  container_app_secrets = [
    for k, v in var.container_app_env_vars : {
      container_app_secret_name = lower(replace(k, "_", "-"))
      env_var_name              = k
      name                      = substr(v, 7, length(v))
    } if startswith(v, "SECRET:")
  ]
}
