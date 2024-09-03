locals {
  region         = var.region
  project_id     = data.google_project.current.project_id
  project_number = data.google_project.current.number

  app     = "api"
  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  db_name            = var.db_name
  db_tier            = var.db_tier
  db_username        = "postgres"
  db_version         = "15"
  db_port            = "5432"
  db_is_public       = var.db_is_public
  db_enable_pgvector = var.db_enable_pgvector

  dns_zone_name   = var.dns_zone_name
  dns_zone_domain = var.dns_zone_name != "" ? trimsuffix(data.google_dns_managed_zone.primary[0].dns_name, ".") : ""
  domain_name     = var.domain_name
  enable_https    = local.domain_name != ""
  alb_domain_name = local.domain_name != "" ? local.domain_name : google_compute_global_address.this.address

  common_gcm_domain_name    = data.terraform_remote_state.common.outputs.gcm_domain_name
  common_gcm_certificate_id = data.terraform_remote_state.common.outputs.gcm_certificate_id
  custom_gcm_certificate_id = var.gcm_certificate_id
  gcm_certificate_id        = local.domain_name == "" ? "" : (local.custom_gcm_certificate_id == "" ? local.common_gcm_certificate_id : local.custom_gcm_certificate_id)

  vpc_self_link    = data.terraform_remote_state.common.outputs.vpc.self_link
  vpc_connector_id = data.terraform_remote_state.common.outputs.vpc.connector.id

  run_name                = "${local.resource_basename}-${local.app}"
  run_service_account     = "${local.project_number}-compute@developer.gserviceaccount.com"

  run_image               = "${data.terraform_remote_state.common.outputs.arr_docker}/{% if cookiecutter.__monorepo %}api{% else %}main{% endif %}:${var.image_tag}"
  run_server_count_min    = var.run_server_count_min
  run_server_count_max    = var.run_server_count_max
  run_server_limit_cpu    = var.run_server_limit_cpu
  run_server_limit_memory = var.run_server_limit_memory

  {%- if cookiecutter.auth == "keycloak" %}

  run_keycloak_limit_cpu    = var.run_keycloak_limit_cpu
  run_keycloak_limit_memory = var.run_keycloak_limit_memory
  keycloak_image_tag        = var.keycloak_image_tag
  keycloak_basepath         = var.keycloak_basepath

  {%- endif %}

  run_envs = [
    for k, v in var.run_env_vars : {
      name  = k
      value = v
    } if !startswith(v, "SECRET:")
  ]

  run_secrets = [
    for k, v in var.run_env_vars : {
      env_var_name = k
      name         = substr(v, 7, length(v))
    } if startswith(v, "SECRET:")
  ]
}
