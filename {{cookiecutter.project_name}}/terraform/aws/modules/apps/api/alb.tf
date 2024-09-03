resource "aws_alb" "this" {
  name               = "${local.cluster_name}-${local.app}"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [local.sg_id_alb_public]
  subnets            = local.public_subnets

  tags = local.tags
}

resource "aws_alb_target_group" "this" {
  deregistration_delay = "15"

  name        = "${local.cluster_name}-${local.app}"
  vpc_id      = local.vpc_id
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"

  stickiness {
    type    = "app_cookie"
    enabled = false
  }

  health_check {
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 15
    matcher             = "200"
  }

  tags = local.tags
}

resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_alb.this.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.this.arn
  }

  tags = local.tags
}

resource "aws_alb_listener_rule" "http_redirect" {
  count        = local.enable_https ? 1 : 0
  listener_arn = aws_alb_listener.http.arn
  priority     = 100

  action {
    type = "redirect"

    redirect {
      port        = "443"
      status_code = "HTTP_301"
      protocol    = "HTTPS"
      host        = "#{host}"
      path        = "/#{path}"
      query       = "#{query}"
    }
  }

  dynamic "condition" {
    for_each = local.domain_name == "" ? {} : { "_" = [local.domain_name] }
    iterator = host_header

    content {
      host_header {
        values = host_header.value
      }
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }

  tags = local.tags
}

resource "aws_alb_listener" "https" {
  count             = local.enable_https ? 1 : 0
  load_balancer_arn = aws_alb.this.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = local.enable_https_self_signed ? aws_acm_certificate.self_signed[0].arn : local.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.this.arn
  }

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

resource "aws_alb_listener_rule" "https_forward" {
  count        = local.enable_https ? 1 : 0
  listener_arn = aws_alb_listener.https[0].arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.this.arn
  }

  dynamic "condition" {
    for_each = local.domain_name == "" ? {} : { "_" = [local.domain_name] }
    iterator = host_header

    content {
      host_header {
        values = host_header.value
      }
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }

  tags = local.tags
}

{%- if cookiecutter.auth == "keycloak" %}

resource "aws_alb_listener_rule" "http_forward_keycloak" {
  count        = local.enable_https ? 0 : 1
  listener_arn = aws_alb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = module.keycloak.alb_target_group_arn
  }

  condition {
    path_pattern {
      values = [local.keycloak_basepath, "${local.keycloak_basepath}/*"]
    }
  }

  tags = local.tags
}

resource "aws_alb_listener_rule" "https_forward_keycloak" {
  count        = local.enable_https ? 1 : 0
  listener_arn = aws_alb_listener.https[0].arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = module.keycloak.alb_target_group_arn
  }

  dynamic "condition" {
    for_each = local.domain_name == "" ? {} : { "_" = [local.domain_name] }
    iterator = host_header

    content {
      host_header {
        values = host_header.value
      }
    }
  }

  condition {
    path_pattern {
      values = [local.keycloak_basepath, "${local.keycloak_basepath}/*"]
    }
  }

  tags = local.tags
}

{%- endif %}
