output "project_id" {
  value = local.project_id
}

output "arr_docker" {
  value = "${google_artifact_registry_repository.docker.location}-docker.pkg.dev/${google_artifact_registry_repository.docker.project}/${google_artifact_registry_repository.docker.repository_id}"
}

output "gcm_certificate_id" {
  value       = local.gcm_domain_name != "" ? google_certificate_manager_certificate.this[0].id : ""
  description = "ID of the certificate stored at Google Certificate Manager"
}

output "gcm_domain_name" {
  value       = local.gcm_domain_name
  description = "Domain name of the certificate stored at Google Certificate Manager"
}

output "vpc" {
  value = {
    id        = google_compute_network.this.id
    self_link = google_compute_network.this.self_link

    subnetwork = {
      id        = google_compute_subnetwork.this.id
      self_link = google_compute_subnetwork.this.self_link
    }

    connector = {
      id        = google_vpc_access_connector.this.id
      self_link = google_vpc_access_connector.this.self_link
    }
  }

  description = "VPC configuration"
}
