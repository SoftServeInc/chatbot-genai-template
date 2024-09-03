resource "google_project_service" "sqladmin_api" {
  service = "sqladmin.googleapis.com"

  # services that are enabled and which depend on this service should also be disabled when this service is destroyed
  disable_dependent_services = true

  # do not disable the API when this resource is destroyed
  disable_on_destroy = false
}

resource "google_sql_database_instance" "database" {
  name   = "${local.resource_basename}-${local.app}-db"
  region = local.region

  # TODO: keep track of the latest supported version of PostgreSQL https://cloud.google.com/sql/docs/postgres/release-notes
  database_version    = "POSTGRES_${local.db_version}"
  deletion_protection = true

  settings {
    tier = local.db_tier

    ip_configuration {
      ipv4_enabled = local.db_is_public ? true : false

      dynamic "authorized_networks" {
        for_each = local.db_is_public ? [{ name : "All IPs", cidr : "0.0.0.0/0" }] : []
        iterator = network

        content {
          name  = network.value.name
          value = network.value.cidr
        }
      }

      private_network = local.vpc_self_link
    }
  }

  depends_on = [google_project_service.sqladmin_api]
}

resource "google_sql_database" "database" {
  name     = local.db_name
  instance = google_sql_database_instance.database.name
}

resource "google_sql_user" "database" {
  name     = local.db_username
  instance = google_sql_database_instance.database.name
  password = data.google_secret_manager_secret_version.db_password.secret_data
}

provider "postgresql" {
  scheme    = "gcppostgres"
  host      = google_sql_database_instance.database.connection_name
  username  = google_sql_user.database.name
  password  = data.google_secret_manager_secret_version.db_password.secret_data

  expected_version = local.db_version
  connect_timeout  = 15
}

resource "postgresql_extension" "vector" {
  count    = local.db_enable_pgvector ? 1 : 0
  database = local.db_name
  name     = "vector"
  schema   = "public"
}
