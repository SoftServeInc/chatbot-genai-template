resource "azurerm_storage_account" "this" {
  name                     = local.storage_account_name
  resource_group_name      = local.resource_group_name
  location                 = local.region
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }
}



