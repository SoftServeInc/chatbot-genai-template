resource "random_password" "admin_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_key_vault_secret" "admin_password" {
  key_vault_id = var.key_vault_id
  name         = "${local.app}-admin-password"
  value        = random_password.admin_password.result

  lifecycle {
    ignore_changes = [value]
  }
}

data "azurerm_key_vault_secret" "admin_password" {
  key_vault_id = var.key_vault_id
  name         = azurerm_key_vault_secret.admin_password.name

  depends_on = [
    azurerm_key_vault_secret.admin_password
  ]
}

resource "random_password" "api_client_secret" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_key_vault_secret" "api_client_secret" {
  key_vault_id = var.key_vault_id
  name         = "${local.app}-api-client-secret"
  value        = random_password.api_client_secret.result

  lifecycle {
    ignore_changes = [value]
  }
}

data "azurerm_key_vault_secret" "api_client_secret" {
  key_vault_id = var.key_vault_id
  name         = azurerm_key_vault_secret.api_client_secret.name

  depends_on = [
    azurerm_key_vault_secret.api_client_secret
  ]
}
