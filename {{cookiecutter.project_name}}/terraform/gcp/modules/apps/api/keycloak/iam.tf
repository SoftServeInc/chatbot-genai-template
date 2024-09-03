# Allow all users to invoke the Cloud Run service
resource "google_cloud_run_v2_service_iam_member" "this" {
  name     = google_cloud_run_v2_service.this.name
  location = google_cloud_run_v2_service.this.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Allow Cloud Run service to access a particular secret
resource "google_secret_manager_secret_iam_member" "admin_password_compute_access" {
  secret_id = google_secret_manager_secret.admin_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${local.run_service_account}"
}
