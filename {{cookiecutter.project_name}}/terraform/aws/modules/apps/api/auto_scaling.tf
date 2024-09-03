resource "aws_appautoscaling_target" "server" {
  max_capacity = local.task_server_count_min
  min_capacity = local.task_server_count_max

  resource_id        = "service/${local.cluster_name}/${aws_ecs_service.server.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"

  tags = local.tags
}

resource "aws_appautoscaling_policy" "server" {
  name        = "ecs-auto-scaling-policy"
  policy_type = "TargetTrackingScaling"

  resource_id        = aws_appautoscaling_target.server.resource_id
  scalable_dimension = aws_appautoscaling_target.server.scalable_dimension
  service_namespace  = aws_appautoscaling_target.server.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value       = 75
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}
