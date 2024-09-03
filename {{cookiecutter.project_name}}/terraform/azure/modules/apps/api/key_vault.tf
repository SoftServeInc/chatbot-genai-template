resource "random_password" "db_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_key_vault_secret" "db_password" {
  key_vault_id = local.key_vault_id
  name         = "${local.app}-db-password"
  value        = random_password.db_password.result

  lifecycle {
    ignore_changes = [value]
  }
}

data "azurerm_key_vault_secret" "db_password" {
  key_vault_id = local.key_vault_id
  name         = azurerm_key_vault_secret.db_password.name

  depends_on = [
    azurerm_key_vault_secret.db_password
  ]
}

data "azurerm_key_vault_secret" "container_app_secret" {
  for_each     = { for secret in local.container_app_secrets : secret.env_var_name => secret.name if secret.name != "" }
  key_vault_id = local.key_vault_id
  name         = each.value
}
