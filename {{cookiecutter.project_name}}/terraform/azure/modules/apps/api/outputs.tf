locals {
  output_domain_name = local.domain_name != "" ? local.domain_name : azurerm_container_app.server.ingress[0].fqdn
}

output "subscription_id" {
  value = data.azurerm_client_config.current.subscription_id
}

output "resource_group_name" {
  value = local.resource_group_name
}

output "region" {
  description = "Azure Region name"
  value       = local.region
}

output "image" {
  description = "Deployed docker image"
  value       = local.container_app_image
}

output "domain_name" {
  description = "Domain name"
  value       = local.output_domain_name
}

output "url" {
  description = "API URL address"
  value       = "https://${local.output_domain_name}"
}

output "url_swagger" {
  description = "Swagger UI URL address"
  value       = "https://${local.output_domain_name}/swagger-ui/"
}

{%- if cookiecutter.auth == "keycloak" %}

output "url_keycloak" {
  description = "Keycloak URL address"
  value       = "${module.keycloak.url}admin/${module.keycloak.realm_name}/console/"
}

output "keycloak_admin" {
  description = "Keycloak admin credentials"
  value = {
    username           = module.keycloak.admin.username
    password_secret_id = module.keycloak.admin.password_secret_id
  }
}

{%- endif %}

output "db" {
  description = "Database connection info"
  value = {
    is_public          = azurerm_postgresql_flexible_server.this.public_network_access_enabled
    host               = azurerm_postgresql_flexible_server.this.fqdn
    port               = local.db_port
    name               = azurerm_postgresql_flexible_server_database.this.name
    username           = azurerm_postgresql_flexible_server.this.administrator_login
    password_secret_id = azurerm_key_vault_secret.db_password.id
    ssl_mode           = "require"
  }
}
