module "keycloak" {
  source = "./keycloak"

  region  = local.region
  env     = local.env
  project = local.project

  resource_group_name = local.resource_group_name

  dns_zone_name                = local.dns_zone_name
  dns_zone_resource_group_name = local.project_resource_group_name

  container_app_environment_id = local.container_app_environment_id
  key_vault_id                 = local.key_vault_id

  container_app_cpu    = local.container_app_keycloak_cpu
  container_app_memory = local.container_app_keycloak_memory

  image_tag = local.keycloak_image_tag

  hostname      = local.keycloak_hostname
  hostname_path = local.keycloak_basepath

  db_host     = azurerm_postgresql_flexible_server.this.fqdn
  db_port     = local.db_port
  db_name     = local.db_name
  db_username = local.db_username
  db_password = data.azurerm_key_vault_secret.db_password.value
}
