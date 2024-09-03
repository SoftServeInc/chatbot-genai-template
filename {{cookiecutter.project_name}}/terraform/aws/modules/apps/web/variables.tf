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

variable "cache_min_ttl" {
  description = "Minimum time to cache an object"
  type        = number
  default     = 0
}

variable "redirect_to_https" {
  description = "Redirect HTTP to HTTPS"
  type        = bool
  default     = true
}

variable "cache_max_ttl" {
  description = "Maximum time to cache an object"
  type        = number
  default     = 31536000 # 1 year
}

variable "cache_default_ttl" {
  description = "Default time to cache an object"
  type        = number
  default     = 86400 # 1 day
}

variable "cloudfront_price_class" {
  default     = "PriceClass_100" // Only US, Mexico, Canada, Europe, Israel
  description = "CloudFront distribution price class"
}

variable "cloudfront_geo_restriction_type" {
  default     = "none"
  description = "The method that you want to use to restrict distribution of your content by country: none, whitelist, or blacklist."
  validation {
    error_message = "Can only specify either none, whitelist, blacklist"
    condition     = can(regex("^(none|whitelist|blacklist)$", var.cloudfront_geo_restriction_type))
  }

}
variable "cloudfront_geo_restriction_locations" {
  default     = []
  type        = list(string)
  description = "The ISO 3166-1-alpha-2 codes for which you want CloudFront either to distribute your content (whitelist) or not distribute your content (blacklist)."
  validation {
    error_message = "Must be a list of valid ISO 3166-1-alpha-2 code"
    condition     = length([for cc in var.cloudfront_geo_restriction_locations : 1 if length(cc) == 2]) == length(var.cloudfront_geo_restriction_locations)
  }
}

variable "route53_zone_name" {
  description = "Existing Route53 zone name where the <domain_name> alias record for CloudFront distribution should be created. Leave empty if you don't want to create the alias record - e.g., if you manage DNS records on your own"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for the static web site - it will be used to specify alias configuration for CloudFront distribution and to create a Route53 alias record (if route53_zone_name is specified)"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN"
  type        = string
  default     = ""
}
