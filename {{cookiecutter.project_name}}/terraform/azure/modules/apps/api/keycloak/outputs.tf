output "url" {
  value       = "https://${local.domain_name != "" ? local.domain_name : azurerm_container_app.this.ingress[0].fqdn}${local.hostname_path}/"
  description = "Keycloak URL address"
}

output "realm_name" {
  value       = local.realm_name
  description = "Keycloak realm name"
}

output "api_client" {
  value = {
    id               = local.api_client_id
    secret_value     = data.azurerm_key_vault_secret.api_client_secret.value
    secret_secret_id = azurerm_key_vault_secret.api_client_secret.id
  }

  description = "Keycloak API client ID and secret"
}

output "admin" {
  value = {
    username           = "admin"
    password_secret_id = azurerm_key_vault_secret.admin_password.id
  }

  description = "Keycloak admin user credentials"
}
