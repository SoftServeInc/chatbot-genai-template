resource "aws_cloudfront_function" "rewrite" {
  name    = "${local.bucket_name}-rewrite"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite all non-asset requests to index.html"
  publish = true
  code    = file("${path.module}/cloudfront_rewrite_function.js")
}

resource "aws_cloudfront_origin_access_identity" "this" {
  comment = local.bucket_name
}

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name = aws_s3_bucket.this.bucket_regional_domain_name
    origin_id   = local.cloudfront_s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.bucket_name
  default_root_object = "index.html"

  aliases = local.domain_name != "" ? [local.domain_name] : []

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    target_origin_id = local.cloudfront_s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite.arn
    }

    # https://stackoverflow.com/questions/67845341/cloudfront-s3-etag-possible-for-cloudfront-to-send-updated-s3-object-before-t
    min_ttl     = local.cache_min_ttl
    max_ttl     = local.cache_max_ttl
    default_ttl = local.cache_default_ttl

    viewer_protocol_policy = local.redirect_to_https ? "redirect-to-https" : "allow-all"
  }

  price_class = local.cloudfront_price_class

  restrictions {
    geo_restriction {
      restriction_type = local.cloudfront_geo_restriction_type
      locations        = local.cloudfront_geo_restriction_locations
    }
  }

  dynamic "viewer_certificate" {
    for_each = local.acm_certificate_arn != "" ? {} : { "_" = "_" }
    content {
      cloudfront_default_certificate = true
    }
  }

  dynamic "viewer_certificate" {
    for_each = local.acm_certificate_arn == "" ? {} : { "_" = "_" }
    content {
      acm_certificate_arn      = local.acm_certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1"
    }
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    error_caching_min_ttl = 0
    response_page_path    = "/index.html"
  }

  wait_for_deployment = false # it may take a while for the distribution to be deployed

  lifecycle {
    precondition {
      # if domain_name specified the acm_certificate_arn must be specified as well (or pulled from the common state)
      condition     = local.domain_name == "" || local.acm_certificate_arn != ""
      error_message = "When domain_name is specified then acm_certificate_arn must be specified as well (or pulled from the common state)"
    }
    precondition {
      # if domain_name specified but custom_acm_certificate_arn is empty, then it means that the common ACM certificate is going to be used for the https://domain_name and that is why the domain_name must be a subdomain of the common ACM domain name
      condition     = local.domain_name == "" || local.custom_acm_certificate_arn != "" || endswith(local.domain_name, local.common_acm_domain_name)
      error_message = "When domain_name is specified, but custom_acm_certificate_arn is not explicitly specified (that's why the common ACM certificate is going to be used) then the domain_name must be a subdomain of the acm_domain_name from the common state"
    }
  }

  tags = local.tags
}
