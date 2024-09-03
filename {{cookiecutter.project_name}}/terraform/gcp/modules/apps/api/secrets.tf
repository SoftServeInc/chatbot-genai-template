resource "google_project_service" "secretmanager_api" {
  service = "secretmanager.googleapis.com"

  # services that are enabled and which depend on this service should also be disabled when this service is destroyed
  disable_dependent_services = true

  # do not disable the API when this resource is destroyed
  disable_on_destroy = false
}

resource "random_password" "db_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "${local.resource_basename}-${local.app}-db-password"

  replication {
    user_managed {
      replicas {
        # Do not replicate the secret to other regions
        location = local.region
      }
    }
  }

  depends_on = [google_project_service.secretmanager_api]
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result # Stores secret as a plain txt in state

  lifecycle {
    ignore_changes = [secret_data]
  }
}

data "google_secret_manager_secret_version" "db_password" {
  secret = google_secret_manager_secret.db_password.id
  depends_on = [
    google_secret_manager_secret_version.db_password,
    google_secret_manager_secret_iam_member.db_password_compute_access
  ]
}
