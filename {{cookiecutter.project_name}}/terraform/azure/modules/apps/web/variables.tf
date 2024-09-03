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

variable "dns_zone_name" {
  description = "Existing Azure managed DNS zone name belonging to the resource group specified in `project_resource_group_name`"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the static web site - it will be used to specify custom domain name for Azure CDN endpoint"
  type        = string
  default     = ""
}
