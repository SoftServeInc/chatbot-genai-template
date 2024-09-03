variable "region" {
  description = "GCP Region"
  type        = string
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "project_number" {
  description = "GCP Project Number"
  type        = string
}

variable "env" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "vpc_connector_id" {
  description = "VPC Connector ID to be used by Cloud Run service"
  type        = string
}

variable "run_limit_cpu" {
  description = "Keycloak container CPU limit"
  type        = string
}

variable "run_limit_memory" {
  description = "Keycloak container memory limit"
  type        = string
}

variable "run_service_account" {
  description = "Keycloak Cloud Run service account"
  type        = string
}

variable "image_tag" {
  description = "Keycloak Docker image tag"
  type        = string
}

variable "hostname" {
  description = "Keycloak hostname"
  type        = string
}

variable "enable_https" {
  description = "Whether to enable HTTPS or not"
  type        = bool
}

variable "hostname_path" {
  description = "Keycloak hostname path"
  type        = string
}

variable "db_host" {
  description = "Database hostname"
  type        = string
}

variable "db_port" {
  description = "Database port"
  type        = number
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password_secret_name" {
  description = "Database password secret name"
  type        = string
}

