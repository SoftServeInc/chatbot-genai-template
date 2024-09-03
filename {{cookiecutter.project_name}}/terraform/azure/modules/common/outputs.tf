output "subscription_id" {
  value = data.azurerm_client_config.current.subscription_id
}

output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "acr_name" {
  value = azurerm_container_registry.this.name
}

output "acr_server" {
  value = azurerm_container_registry.this.login_server
}

output "acr_admin_credentials" {
  value = {
    username = azurerm_container_registry.this.admin_username
    password = azurerm_container_registry.this.admin_password
  }
  sensitive = true
}

output "container_app_environment_id" {
  value = azurerm_container_app_environment.this.id
}

output "key_vault_name" {
  value = azurerm_key_vault.this.name
}

output "key_vault_id" {
  value = azurerm_key_vault.this.id
}
