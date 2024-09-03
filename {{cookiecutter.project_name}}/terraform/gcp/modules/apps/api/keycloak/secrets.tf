resource "random_password" "admin_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "google_secret_manager_secret" "admin_password" {
  secret_id = "${local.resource_basename}-${local.app}-admin-password"

  replication {
    user_managed {
      replicas {
        # Do not replicate the secret to other regions
        location = local.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "admin_password" {
  secret      = google_secret_manager_secret.admin_password.id
  secret_data = random_password.admin_password.result # Stores secret as a plain txt in state

  lifecycle {
    ignore_changes = [secret_data]
  }
}

resource "random_password" "api_client_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "google_secret_manager_secret" "api_client_secret" {
  secret_id = "${local.resource_basename}-${local.app}-api-client-secret"

  replication {
    user_managed {
      replicas {
        # Do not replicate the secret to other regions
        location = local.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "api_client_secret" {
  secret      = google_secret_manager_secret.api_client_secret.id
  secret_data = random_password.api_client_secret.result # Stores secret as a plain txt in state

  lifecycle {
    ignore_changes = [secret_data]
  }
}
