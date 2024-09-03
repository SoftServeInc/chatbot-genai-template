locals {
  region     = var.region
  account_id = data.aws_caller_identity.current.account_id

  app     = "web"
  env     = var.env
  project = var.project

  resource_basename = "${local.project}-${local.env}"

  bucket_name = "${local.resource_basename}-${local.app}"

  route53_zone_name = var.route53_zone_name
  route53_zone_id   = var.route53_zone_name != "" ? data.aws_route53_zone.primary[0].zone_id : ""
  domain_name       = var.domain_name

  common_acm_domain_name     = data.terraform_remote_state.common.outputs.acm_domain_name
  common_acm_certificate_arn = data.terraform_remote_state.common.outputs.acm_certificate_arn
  custom_acm_certificate_arn = var.acm_certificate_arn
  acm_certificate_arn        = local.domain_name == "" ? "" : (local.custom_acm_certificate_arn == "" ? local.common_acm_certificate_arn : local.custom_acm_certificate_arn)

  cache_min_ttl     = var.cache_min_ttl
  cache_max_ttl     = var.cache_max_ttl
  cache_default_ttl = var.cache_default_ttl
  redirect_to_https = var.redirect_to_https

  cloudfront_s3_origin_id = "${local.bucket_name}-s3"
  cloudfront_price_class  = var.cloudfront_price_class

  cloudfront_geo_restriction_type      = var.cloudfront_geo_restriction_type
  cloudfront_geo_restriction_locations = var.cloudfront_geo_restriction_locations

  tags = {
    environment      = local.env
    project          = local.project
    infrastructure   = "terraform"
    terraform-module = "common"
  }
}
