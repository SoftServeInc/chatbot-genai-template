locals {
  output_domain_name = local.domain_name != "" ? local.domain_name : aws_cloudfront_distribution.this.domain_name
}

output "region" {
  description = "AWS Region name"
  value       = local.region
}

output "bucket_name" {
  description = "S3 bucket name"
  value       = local.bucket_name
}

output "domain_name" {
  description = "Domain name"
  value       = local.output_domain_name
}

output "url" {
  description = "URL address"
  value       = "${local.redirect_to_https ? "https" : "http"}://${local.output_domain_name}"
}

output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.this.id
}
