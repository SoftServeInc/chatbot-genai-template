output "project_id" {
  value = local.project_id
}

output "bucket_name" {
  description = "GCS bucket name"
  value       = local.bucket_name
}

output "domain_name" {
  description = "Domain name"
  value       = local.domain_name != "" ? local.domain_name : google_compute_global_address.this.address
}

output "url" {
  description = "URL address"
  value       = local.domain_name != "" ? "https://${local.domain_name}" : "http://${google_compute_global_address.this.address}"
}

output "load_balancer_name" {
  description = "ALB Load Balancer name"
  value       = local.enable_https ? google_compute_url_map.https[0].name : google_compute_url_map.http[0].name
}
