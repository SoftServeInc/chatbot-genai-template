output "project_id" {
  value = local.project_id
}

output "region" {
  description = "GCP Region name"
  value       = local.region
}

output "image" {
  description = "Deployed docker image"
  value       = local.run_image
}

output "domain_name" {
  description = "Domain name"
  value       = local.alb_domain_name
}

output "cloudrun_url" {
  description = "URL address"
  value       = google_cloud_run_v2_service.server.uri
}

output "url" {
  description = "API URL address"
  value       = "${local.enable_https ? "https" : "http"}://${local.alb_domain_name}"
}

output "url_swagger" {
  description = "Swagger UI URL address"
  value       = "${local.enable_https ? "https" : "http"}://${local.alb_domain_name}/swagger-ui/"
}

{%- if cookiecutter.auth == "keycloak" %}

output "url_keycloak" {
  description = "Keycloak URL address"
  value       = "${module.keycloak.url}admin/${module.keycloak.realm_name}/console/"
}

output "keycloak_admin" {
  description = "Keycloak admin credentials"
  value       = {
    username           = module.keycloak.admin.username
    password_secret_id = split("/", module.keycloak.admin.password_secret_id)[3]
  }
}

{%- endif %}

output "db" {
  description = "Database connection info"

  value = {
    is_public          = google_sql_database_instance.database.settings[0].ip_configuration[0].ipv4_enabled
    host               = google_sql_database_instance.database.public_ip_address
    port               = "5432"
    name               = google_sql_database.database.name
    username           = google_sql_user.database.name
    password_secret_id = split("/", google_secret_manager_secret.db_password.id)[3]
  }
}
