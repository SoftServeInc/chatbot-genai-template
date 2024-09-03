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

variable "project_resource_group_name" {
  description = "Project resource group name"
  type        = string
}

variable "project_storage_account_name" {
  description = "Project storage account name"
  type        = string
}

variable "project_storage_tfstate_container_name" {
  description = "Project storage account container name where terraform state is stored"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "container_app_server_cpu" {
  description = "Container app CPU"
  type        = number
  default     = 0.25
}

variable "container_app_server_memory" {
  description = "Container app memory"
  type        = string
  default     = "0.5Gi"
}

variable "container_app_server_min_replicas" {
  description = "Container app min replicas"
  type        = number
  default     = 1
}

variable "container_app_server_max_replicas" {
  description = "Container app max replicas"
  type        = number
  default     = 1
}

variable "container_app_env_vars" {
  description = "Environment variables for the Container app"
  type        = map(string)
  default     = {}
}

variable "db_name" {
  description = "Postgres DB name"
  type        = string
  default     = "postgres"
}

variable "db_sku_name" {
  # https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-compute-storage#compute-tiers-vcores-and-server-types
  description = "The SKU Name for the PostgreSQL Flexible Server. The name of the SKU, follows the tier + name pattern (e.g. B_Standard_B1ms, GP_Standard_D2s_v3, MO_Standard_E4s_v3)."
  type        = string
  default     = "B_Standard_B1ms"
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

variable "dns_zone_name" {
  description = "Existing Azure managed DNS zone name belonging to the resource group specified in `project_resource_group_name`"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the API - it will be used to specify custom domain name for Azure Container App"
  type        = string
  default     = ""
}

{%- if cookiecutter.auth == "keycloak" %}

variable "container_app_keycloak_cpu" {
  description = "Container app CPU for Keycloak"
  type        = number
  default     = 1.0
}

variable "container_app_keycloak_memory" {
  description = "Container app memory for Keycloak"
  type        = string
  default     = "1Gi"
}

variable "keycloak_image_tag" {
  description = "Keycloak Docker image tag"
  type        = string
  default     = "24.0.4"
}

variable "keycloak_hostname" {
  description = "Keycloak hostname"
  type        = string
  default     = ""
}

variable "keycloak_basepath" {
  description = "Keycloak base path"
  type        = string
  default     = ""
}

{%- endif %}
