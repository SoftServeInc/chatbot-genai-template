variable "env" {
  description = "Environment name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "region" {
  description = "AWS Region name"
  type        = string
}

variable "account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "vpc_id" {
  description = "ID (ARN) of the VPC"
  type        = string
}

variable "cluster_id" {
  description = "ID (ARN) of the ECS cluster"
  type        = string
}

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "security_group_id" {
  description = "ID of the security group"
  type        = string
}

variable "task_cpu" {
  description = "CPU units to reserve for the ECS task"
  type        = number
}

variable "task_memory" {
  description = "Memory to reserve for the ECS task"
  type        = number
}

variable "image_tag" {
  description = "Keycloak Docker image tag"
  type        = string
}

variable "subnets" {
  description = "Subnets to deploy the ECS task"
  type        = list(string)
}

variable "task_log_retention_in_days" {
  description = "ECS task Log retention in days"
  type        = number
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

variable "db_password_secret_id" {
  description = "Database password secret ID (ARN)"
  type        = string
}
