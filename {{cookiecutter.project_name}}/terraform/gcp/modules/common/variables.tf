variable "env" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "region" {
  description = "GCP Region name"
  type        = string
}

variable "dns_zone_name" {
  description = "Existing GCP managed DNS zone name"
  type        = string
  default     = ""
}

variable "gcm_domain_name" {
  description = "The domain name for the wildcard certificate to be created in GCP Certificate Manager (GCM); it must be a domain/subdomain of the zone specified in dns_zone_name"
  type        = string
  default     = ""
}
