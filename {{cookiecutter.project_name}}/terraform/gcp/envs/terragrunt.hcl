
locals {
  # gcloud iam service-accounts keys create credentials.json --iam-account=${SERVICE_ACCOUNT_EMAIL}
  gcp_project_id     = "[project-id]" // FIXME: replace with your GCP project ID
  gcp_credentials    = get_env("USE_GCP_CREDENTIALS_FILE", "0") == "1" ? find_in_parent_folders("credentials.json") : null
  region             = "us-central1"
  project            = "{{ cookiecutter.project_name }}"
  tfstate_bucket     = "${local.project}-tfstate"

  // Set to "" if you don't have a domain name yet or if the DNS zone is managed outside of GCP
  // It must be already existing GCP Cloud DNS zone name (not domain name) belonging to the same GCP project as the one you're deploying to.
  dns_zone_name = "" // "example-com"
}

remote_state {
  backend = "gcs"

  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }

  config = {
    location    = "US" // https://cloud.google.com/storage/docs/locations
    project     = local.gcp_project_id
    credentials = local.gcp_credentials
    bucket      = local.tfstate_bucket
    prefix      = path_relative_to_include()
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "google" {
  region      = "${local.region}"
  project     = "${local.gcp_project_id}"
  credentials = ${local.gcp_credentials == null ? "null" : "\"${local.gcp_credentials}\""}
}
EOF
}

generate "google_project" {
  path      = "google_project.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
data "google_project" "current" {}
EOF
}

generate "terraform" {
  path      = "versions.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_version = ">= 1.6.5, < 2.0.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.32"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
      version = "~> 1.21"
    }
  }
}
EOF
}

# terraform {
#   # Force Terraform to keep trying to acquire a lock for
#   # up to 20 minutes if someone else already has the lock
#   extra_arguments "retry_lock" {
#     commands  = get_terraform_commands_that_need_locking()
#     arguments = [
#       "-lock-timeout=20m"
#     ]
#   }
# }

inputs = {
  project        = local.project
  region         = local.region
  tfstate_bucket = local.tfstate_bucket
  dns_zone_name  = local.dns_zone_name
}
