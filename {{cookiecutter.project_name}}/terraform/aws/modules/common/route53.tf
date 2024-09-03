data "aws_route53_zone" "primary" {
  count = local.route53_zone_name != "" ? 1 : 0
  name  = local.route53_zone_name
}

resource "aws_acm_certificate" "domain" {
  count    = local.acm_domain_name != "" ? 1 : 0
  provider = aws.acm

  domain_name               = local.acm_domain_name
  subject_alternative_names = ["*.${local.acm_domain_name}"]

  validation_method = "DNS"

  tags = local.tags
}

locals {
  dvo = local.acm_domain_name != "" ? tolist(aws_acm_certificate.domain[0].domain_validation_options)[0] : {}
}

resource "aws_route53_record" "acm_domain_validation" {
  count = local.acm_domain_name != "" ? 1 : 0

  zone_id = local.route53_zone_id
  ttl     = 60
  name    = local.dvo.resource_record_name
  type    = local.dvo.resource_record_type
  records = [local.dvo.resource_record_value]

  lifecycle {
    precondition {
      condition     = endswith(local.acm_domain_name, local.route53_zone_name)
      error_message = "The ACM domain name must be a subdomain of the Route53 zone name"
    }
  }
}

resource "aws_acm_certificate_validation" "domain" {
  count = local.acm_domain_name != "" ? 1 : 0

  certificate_arn         = aws_acm_certificate.domain[0].arn
  validation_record_fqdns = [aws_route53_record.acm_domain_validation[0].fqdn]
}
