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

variable "tfstate_bucket" {
  description = "S3 bucket for storing Terraform state"
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

variable "db_instance_class" {
  description = "DB instance class"
  type        = string
  default     = "db.t4g.micro"
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

variable "task_server_cpu" {
  description = "CPU units for the ECS task"
  type        = number
  default     = 256
}

variable "task_server_memory" {
  description = "RAM for the ECS task"
  type        = number
  default     = 512
}

variable "task_server_count_min" {
  description = "Minimum number of ECS tasks to run (autoscaling)"
  type        = number
  default     = 1
}

variable "task_server_count_max" {
  description = "Maximum number of ECS tasks to run (autoscaling)"
  type        = number
  default     = 1
}

variable "task_log_retention_in_days" {
  description = "Number of days to retain CloudWatch logs for the ECS task"
  type        = number
  default     = 7
}

variable "task_env_vars" {
  description = "Environment variables for the ECS task"
  type        = map(string)
  default     = {}
}

{%- if cookiecutter.auth == "keycloak" %}

variable "task_keycloak_cpu" {
  description = "CPU units for the Keycloak ECS task"
  type        = number
  default     = 512
}

variable "task_keycloak_memory" {
  description = "RAM for the Keycloak ECS task"
  type        = number
  default     = 1024
}

variable "keycloak_image_tag" {
  description = "Keycloak Docker image tag"
  type        = string
  default     = "24.0.5"
}

variable "keycloak_basepath" {
  description = "Keycloak base path"
  type        = string
  default     = "/keycloak"
}

{%- endif %}

variable "route53_zone_name" {
  description = "Existing Route53 zone name where the <domain_name> alias record for ALB should be created. Leave empty if you don't want to create the alias record - e.g., if you manage DNS records on your own"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the API - it will be used to specify HTTPS listener for the ALB and to create a Route53 alias record (if route53_zone_name is specified)"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for the domain name specified in domain_name"
  type        = string
  default     = ""
}

variable "enable_https_self_signed" {
  description = "Whether to enable self-signed SSL certificate for the ALB"
  type        = bool
  default     = false
}
