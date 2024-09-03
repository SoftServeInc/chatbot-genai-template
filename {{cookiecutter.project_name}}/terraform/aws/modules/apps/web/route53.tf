
data "aws_route53_zone" "primary" {
  count = local.route53_zone_name != "" ? 1 : 0
  name  = local.route53_zone_name
}

resource "aws_route53_record" "domain" {
  count   = local.route53_zone_id != "" && local.domain_name != "" ? 1 : 0
  zone_id = local.route53_zone_id
  name    = local.domain_name
  type    = "A"

  # https://stackoverflow.com/questions/50281606/what-exactly-is-the-purpose-of-the-hosted-zone-id-for-elb-and-beanstalk-and-othe
  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = false
  }
}
