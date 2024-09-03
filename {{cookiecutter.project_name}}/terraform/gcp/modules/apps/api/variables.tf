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

variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "db_name" {
  description = "Postgres DB name"
  type        = string
  default     = "postgres"
}

variable "db_tier" {
  # https://cloud.google.com/sql/pricing#instance-pricing
  # https://cloud.google.com/sql/docs/postgres/instance-settings

  description = "DB tier, a.k.a. machine type to use"
  type        = string
  default     = "db-f1-micro"
}

variable "db_is_public" {
  description = "Whether the DB is public or not"
  type        = bool
  default     = false
}

variable "db_enable_pgvector" {
  description = "Whether to enable PostgreSQL pgvector extension or not"
  type        = bool
  default     = false
}

variable "run_server_limit_cpu" {
  description = "CPU limit for the Cloud Run server service container"
  type        = string
  default     = "1"
}

variable "run_server_limit_memory" {
  description = "Memory limit for the Cloud Run keycloak service container"
  type        = string
  default     = "512Mi"
}

variable "run_server_count_min" {
  description = "Minimum number of Cloud Run server service instances to run (autoscaling)"
  type        = number
  default     = 1
}

variable "run_server_count_max" {
  description = "Maximum number of Cloud Run server service instances to run (autoscaling)"
  type        = number
  default     = 1
}

variable "run_env_vars" {
  description = "Environment variables for the Cloud Run server service"
  type        = map(string)
  default     = {}
}

{%- if cookiecutter.auth == "keycloak" %}

variable "run_keycloak_limit_cpu" {
  description = "CPU limit for the Cloud Run keycloak service container"
  type        = string
  default     = "1"
}

variable "run_keycloak_limit_memory" {
  description = "Memory limit for the Cloud Run keycloak service container"
  type        = string
  default     = "1024Mi"
}

variable "keycloak_image_tag" {
  description = "Keycloak Docker image tag"
  type        = string
  default     = "24.0.4"
}

variable "keycloak_basepath" {
  description = "Keycloak base path"
  type        = string
  default     = "/keycloak"
}

{%- endif %}

variable "dns_zone_name" {
  description = "Existing GCP managed DNS zone name - it must be already Cloud DNS zone belonging to the same GCP project"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the API - it will be used to specify HTTPS proxy for the ALB and to create a DNS record (if dns_zone_name is specified)"
  type        = string
  default     = ""
}

variable "gcm_certificate_id" {
  description = "Google Certificate Manager (GCM) certificate ID for the domain name specified in domain_name"
  type        = string
  default     = ""
}
