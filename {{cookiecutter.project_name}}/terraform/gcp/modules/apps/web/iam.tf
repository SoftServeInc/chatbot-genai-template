resource "google_cloudfunctions2_function_iam_member" "index" {
  cloud_function = google_cloudfunctions2_function.index.name
  location       = google_cloudfunctions2_function.index.location
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "index" {
  name     = google_cloudfunctions2_function.index.name
  location = google_cloudfunctions2_function.index.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
