resource "azurerm_container_app_environment" "this" {
  location                   = local.region
  resource_group_name        = azurerm_resource_group.this.name
  name                       = local.container_app_environment_name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id
}
