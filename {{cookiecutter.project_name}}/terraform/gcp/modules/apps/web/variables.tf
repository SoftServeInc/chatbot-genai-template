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

variable "tfstate_bucket" {
  description = "GCS bucket for storing Terraform state"
  type        = string
}

variable "cache_default_ttl" {
  description = "Default time to cache an object"
  type        = number
  default     = 86400 # 1 day
}

variable "cache_max_ttl" {
  description = "Maximum time to cache an object"
  type        = number
  default     = 31536000 # 1 year
}

variable "dns_zone_name" {
  description = "Existing GCP managed DNS zone name - it must be already Cloud DNS zone belonging to the same GCP project"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the static web site - it will be used to specify HTTPS proxy for the ALB and to create a DNS record (if dns_zone_name is specified)"
  type        = string
  default     = ""
}

variable "gcm_certificate_id" {
  description = "Google Certificate Manager (GCM) certificate ID for the domain name specified in domain_name"
  type        = string
  default     = ""
}
