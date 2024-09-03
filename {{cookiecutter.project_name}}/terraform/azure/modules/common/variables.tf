variable "env" {
  description = "Environment name"
  type        = string
}

variable "region" {
  description = "Azure Region name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "dns_zone_name" {
  description = "Existing GCP managed DNS zone name"
  type        = string
  default     = ""
}
