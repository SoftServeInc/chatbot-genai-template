resource "aws_alb_target_group" "this" {
  deregistration_delay = "15"

  name        = "${var.cluster_name}-${local.app}"
  vpc_id      = var.vpc_id
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"

  stickiness {
    type    = "app_cookie"
    enabled = false
  }

  health_check {
    path                = "${local.hostname_path}/health/ready"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 20
    matcher             = "200"
  }

  tags = local.tags
}
