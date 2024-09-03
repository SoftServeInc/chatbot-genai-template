locals {
  region     = var.region
  account_id = data.aws_caller_identity.current.account_id

  app     = "api"
  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  db_name            = var.db_name
  db_username        = "postgres"
  db_instance_class  = var.db_instance_class
  db_port            = "5432"
  db_version         = "16.1"
  db_is_public       = var.db_is_public
  db_enable_pgvector = var.db_enable_pgvector

  cluster_id   = data.terraform_remote_state.common.outputs.ecs_cluster_id
  cluster_name = data.terraform_remote_state.common.outputs.ecs_cluster_name
  vpc_id       = data.terraform_remote_state.common.outputs.vpc_id
  vpc_name     = data.terraform_remote_state.common.outputs.vpc_name

  public_subnets  = data.terraform_remote_state.common.outputs.public_subnets
  private_subnets = data.terraform_remote_state.common.outputs.private_subnets

  sg_id_cluster           = data.terraform_remote_state.common.outputs.sg_id_cluster
  sg_id_postgres_internal = data.terraform_remote_state.common.outputs.sg_id_postgres_internal
  sg_id_postgres_public   = data.terraform_remote_state.common.outputs.sg_id_postgres_public
  sg_id_alb_public        = data.terraform_remote_state.common.outputs.sg_id_alb_public
  sg_id_bastion_public    = data.terraform_remote_state.common.outputs.sg_id_bastion_public

  route53_zone_name = var.route53_zone_name
  route53_zone_id   = var.route53_zone_name != "" ? data.aws_route53_zone.primary[0].zone_id : ""
  domain_name       = var.domain_name

  common_acm_domain_name     = data.terraform_remote_state.common.outputs.acm_domain_name
  common_acm_certificate_arn = data.terraform_remote_state.common.outputs.acm_certificate_arn
  custom_acm_certificate_arn = var.acm_certificate_arn
  acm_certificate_arn        = local.domain_name == "" ? "" : (local.custom_acm_certificate_arn == "" ? local.common_acm_certificate_arn : local.custom_acm_certificate_arn)
  enable_https_self_signed   = local.domain_name == "" && var.enable_https_self_signed
  enable_https               = local.domain_name != "" || local.enable_https_self_signed
  alb_domain_name            = local.domain_name != "" ? local.domain_name : aws_alb.this.dns_name

  task_image                 = "${data.terraform_remote_state.common.outputs.ecr_repo_api}:${var.image_tag}"
  task_server_count_min      = var.task_server_count_min
  task_server_count_max      = var.task_server_count_max
  task_server_cpu            = var.task_server_cpu
  task_server_memory         = var.task_server_memory
  task_log_retention_in_days = var.task_log_retention_in_days

  {%- if cookiecutter.auth == "keycloak" %}

  task_keycloak_cpu    = var.task_keycloak_cpu
  task_keycloak_memory = var.task_keycloak_memory
  keycloak_image_tag   = var.keycloak_image_tag
  keycloak_basepath    = var.keycloak_basepath

  {%- endif %}

  task_envs = [
    for k, v in var.task_env_vars : {
      name  = k
      value = v
    } if !startswith(v, "SECRET:") && !startswith(v, "PARAMETER:")
  ]

  task_params = [
    for k, v in var.task_env_vars : {
      env_var_name = k
      name         = substr(v, 10, length(v))
    } if startswith(v, "PARAMETER:")
  ]

  task_secrets = [
    for k, v in var.task_env_vars : {
      env_var_name = k
      name         = split(":", v)[1]
      key          = length(split(":", v)) > 2 ? split(":", v)[2] : ""
    } if startswith(v, "SECRET:")
  ]

  tags = {
    project          = local.project
    environment      = local.env
    infrastructure   = "terraform"
    terraform-module = "apps/api"
  }
}
