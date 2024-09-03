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

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "dns_zone_name" {
  description = "DNS zone name"
  type        = string
}

variable "dns_zone_resource_group_name" {
  description = "DNS zone resource group name"
  type        = string
}

variable "container_app_environment_id" {
  description = "Container app environment ID"
  type        = string
}

variable "key_vault_id" {
  description = "Key Vault ID"
  type        = string
}

variable "container_app_cpu" {
  description = "Container app CPU"
  type        = number
}

variable "container_app_memory" {
  description = "Container app memory"
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

variable "db_password" {
  description = "Database password"
  type        = string
}

