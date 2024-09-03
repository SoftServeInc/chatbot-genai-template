output "region" {
  description = "AWS Region name"
  value       = local.region
}

output "image" {
  description = "Deployed docker image"
  value       = local.task_image
}

output "domain_name" {
  description = "Domain name"
  value       = local.alb_domain_name
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
    password_secret_id = module.keycloak.admin.password_secret_id
  }
}

{%- endif %}

output "db" {
  description = "Database connection info"
  value = {
    is_public          = aws_db_instance.database.publicly_accessible
    host               = aws_db_instance.database.address
    port               = aws_db_instance.database.port
    name               = aws_db_instance.database.db_name
    username           = aws_db_instance.database.username
    password_secret_id = aws_secretsmanager_secret.db_password.id
  }
}
