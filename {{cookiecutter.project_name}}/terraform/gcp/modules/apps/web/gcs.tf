resource "google_storage_bucket" "this" {
  provider = google
  name     = local.bucket_name
  location = local.bucket_location

  uniform_bucket_level_access = true
  storage_class               = "STANDARD"

  // delete bucket and contents on destroy.
  force_destroy = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

resource "google_storage_bucket_iam_member" "this" {
  bucket = google_storage_bucket.this.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
