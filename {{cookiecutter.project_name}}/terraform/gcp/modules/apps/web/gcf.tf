data "local_file" "gcf_index" {
  filename = "${path.module}/gcf_index.js"
}

data "archive_file" "gcf_index" {
  type        = "zip"
  output_path = "${path.module}/tmp/gcf_index.zip"

  source {
    content  = data.local_file.gcf_index.content
    filename = "function.js"
  }
}

resource "google_storage_bucket" "gcf_source" {
  name     = "${local.bucket_name}-gcf-source"
  location = local.bucket_location

  uniform_bucket_level_access = true
  storage_class               = "STANDARD"

  // delete bucket and contents on destroy.
  force_destroy = true
}

resource "google_storage_bucket_object" "gcf_index" {
  name         = "index-${substr(data.archive_file.gcf_index.output_md5, 0, 7)}.zip"
  content_type = "application/zip"

  bucket = google_storage_bucket.gcf_source.name
  source = data.archive_file.gcf_index.output_path
}

resource "google_cloudfunctions2_function" "index" {
  name        = "${local.bucket_name}-index"
  location    = local.region
  description = "A simple HTTP Cloud Function that returns the index.html file from a GCS bucket."

  build_config {
    runtime     = "nodejs20"
    entry_point = "index"

    source {
      storage_source {
        bucket = google_storage_bucket.gcf_source.name
        object = google_storage_bucket_object.gcf_index.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    timeout_seconds    = 10
    available_memory   = "256M"

    environment_variables = {
      BUCKET_NAME = local.bucket_name
    }
  }
}
