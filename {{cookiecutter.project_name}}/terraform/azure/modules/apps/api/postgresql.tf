resource "azurerm_postgresql_flexible_server" "this" {
  name                = local.postgresql_server_name
  location            = local.region
  resource_group_name = local.resource_group_name

  sku_name               = "B_Standard_B1ms" # https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-compute-storage
  storage_mb             = 32768
  auto_grow_enabled      = true
  backup_retention_days  = 7
  administrator_login    = local.db_username
  administrator_password = data.azurerm_key_vault_secret.db_password.value
  zone                   = "1"
  version                = "16"

  authentication {
    password_auth_enabled = true
  }
}

resource "azurerm_postgresql_flexible_server_database" "this" {
  name      = local.db_name
  server_id = azurerm_postgresql_flexible_server.this.id
  collation = "en_US.utf8"
  charset   = "utf8"

  # prevent the possibility of accidental data loss
  lifecycle {
    prevent_destroy = true
  }
}

# TODO: If you need to configure Private access you also should deploy virtual network, subnet, private dns zone and private dns zone virtual network link
#       The basic example here https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure" {
  count = var.db_is_public ? 1 : 0

  name             = "allow-access-from-azure-services"
  server_id        = azurerm_postgresql_flexible_server.this.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "all" {
  count = var.db_is_public ? 1 : 0

  name             = "allow-access-from-all-ips"
  server_id        = azurerm_postgresql_flexible_server.this.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

resource "azurerm_postgresql_flexible_server_configuration" "extensions" {
  server_id = azurerm_postgresql_flexible_server.this.id
  name      = "azure.extensions"
  value     = "VECTOR"
}

provider "postgresql" {
  host             = azurerm_postgresql_flexible_server.this.fqdn
  username         = azurerm_postgresql_flexible_server.this.administrator_login
  password         = azurerm_postgresql_flexible_server.this.administrator_password
  expected_version = "16"
  connect_timeout  = 15
}

resource "postgresql_extension" "vector" {
  count    = local.db_enable_pgvector ? 1 : 0
  database = local.db_name
  name     = "vector"
  schema   = "public"

  depends_on = [azurerm_postgresql_flexible_server_configuration.extensions]
}
