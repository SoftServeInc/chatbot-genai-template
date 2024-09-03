# Allow all users to invoke the Cloud Run service
resource "google_cloud_run_v2_service_iam_member" "server" {
  name     = google_cloud_run_v2_service.server.name
  location = google_cloud_run_v2_service.server.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Allow Cloud Run service to access the Vertex AI
resource "google_project_iam_member" "vertex_ai_compute_access" {
  project = local.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${local.run_service_account}"
}

# Allow Cloud Run service to access the Secrets Manager
resource "google_project_iam_member" "secrets_compute_access" {
  project = local.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${local.run_service_account}"

  condition {
    title      = "${local.resource_basename}-*"
    expression = "resource.name.startsWith(\"projects/${local.project_number}/secrets/${local.resource_basename}-\")"
  }
}

# Allow Cloud Run service to access a particular secret
resource "google_secret_manager_secret_iam_member" "db_password_compute_access" {
  secret_id = google_secret_manager_secret.db_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${local.run_service_account}"
}
