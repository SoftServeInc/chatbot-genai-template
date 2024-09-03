resource "google_artifact_registry_repository" "docker" {
  location      = local.region
  repository_id = local.docker_repository_name
  description   = "Docker repository for service images"
  format        = "DOCKER"
  mode          = "STANDARD_REPOSITORY"

  docker_config {
    immutable_tags = false
  }
}
