module "keycloak" {
  source = "./keycloak"

  env        = local.env
  project    = local.project
  region     = local.region
  account_id = local.account_id
  vpc_id     = local.vpc_id

  cluster_id        = local.cluster_id
  cluster_name      = local.cluster_name
  security_group_id = local.sg_id_cluster
  subnets           = local.public_subnets

  task_cpu    = local.task_keycloak_cpu
  task_memory = local.task_keycloak_memory

  task_log_retention_in_days = local.task_log_retention_in_days

  image_tag = local.keycloak_image_tag

  hostname      = local.alb_domain_name
  hostname_path = local.keycloak_basepath
  enable_https  = local.enable_https

  db_host               = aws_db_instance.database.address
  db_port               = local.db_port
  db_name               = local.db_name
  db_username           = local.db_username
  db_password_secret_id = aws_secretsmanager_secret.db_password.arn
}
