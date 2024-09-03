module "keycloak" {
  source = "./keycloak"

  region         = local.region
  project_id     = local.project_id
  project_number = local.project_number

  env     = local.env
  project = local.project

  vpc_connector_id = local.vpc_connector_id

  run_limit_cpu       = local.run_keycloak_limit_cpu
  run_limit_memory    = local.run_keycloak_limit_memory
  run_service_account = local.run_service_account

  image_tag = local.keycloak_image_tag

  hostname      = local.alb_domain_name
  hostname_path = local.keycloak_basepath
  enable_https  = local.enable_https

  db_host                 = google_sql_database_instance.database.private_ip_address
  db_port                 = local.db_port
  db_name                 = local.db_name
  db_username             = local.db_username
  db_password_secret_name = google_secret_manager_secret.db_password.name

  depends_on = [
    google_secret_manager_secret_version.db_password,
    google_project_iam_member.secrets_compute_access,
    google_project_service.secretmanager_api,
    google_project_service.cloudrun_api,
  ]
}
