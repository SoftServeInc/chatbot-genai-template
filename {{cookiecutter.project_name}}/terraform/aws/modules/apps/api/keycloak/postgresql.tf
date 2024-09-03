resource "postgresql_schema" "keycloak" {
  name          = "keycloak"
  database      = var.db_name
  owner         = var.db_username
  if_not_exists = true
  drop_cascade  = true
}
