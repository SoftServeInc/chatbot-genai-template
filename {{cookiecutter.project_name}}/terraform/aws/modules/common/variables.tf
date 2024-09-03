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

variable "bastion_cidr_blocks" {
  description = "List of CIDR blocks to allow SSH access to the bastion host"
  type        = list(string)
  default     = []
}

variable "bastion_instance_type" {
  description = "Bastion host instance type"
  type        = string
  default     = "t2.micro"
}

variable "route53_zone_name" {
  description = "Existing Route53 zone name"
  type        = string
  default     = ""
}

variable "acm_domain_name" {
  description = "The domain name for the wildcard certificate to be created in Amazon Certificate Manager (ACM); it must be a domain/subdomain of the zone specified in route53_zone_name"
  type        = string
  default     = ""
}
