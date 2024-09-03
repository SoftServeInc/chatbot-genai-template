resource "azurerm_log_analytics_workspace" "this" {
  location            = local.region
  resource_group_name = local.resource_group_name
  name                = local.log_analytics_workspace_name
}
