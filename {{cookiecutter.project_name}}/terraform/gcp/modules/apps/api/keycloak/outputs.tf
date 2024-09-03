output "compute_backend_service_id" {
  value       = google_compute_backend_service.this.id
  description = "ID of the compute backend service"
}

output "cloudrun_url" {
  value       = google_cloud_run_v2_service.this.uri
  description = "URL of the Cloud Run service"
}

output "url" {
  value       = "${var.enable_https ? "https" : "http"}://${local.hostname}${local.hostname_path}/"
  description = "Keycloak URL address"
}

output "realm_name" {
  value       = local.realm_name
  description = "Keycloak realm name"
}

output "api_client" {
  value = {
    id                 = local.api_client_id
    secret_secret_id   = google_secret_manager_secret.api_client_secret.id
    secret_secret_name = google_secret_manager_secret.api_client_secret.name
  }

  description = "Keycloak API client ID and secret"
}

output "admin" {
  value = {
    username             = "admin"
    password_secret_id   = google_secret_manager_secret.admin_password.id
    password_secret_name = google_secret_manager_secret.admin_password.name
  }

  description = "Keycloak admin user credentials"
}
