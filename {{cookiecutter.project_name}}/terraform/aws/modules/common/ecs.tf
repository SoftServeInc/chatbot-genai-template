resource "aws_ecs_cluster" "apps" {
  name = local.cluster_name

  configuration {
    // The details of the execute command configuration.
    // ECS Exec allows to interact with containers directly without needing to first interact with the host container operating system.
    execute_command_configuration {
      logging = "DEFAULT" // The 'awslogs' configuration in the task definition is used; this driver sends container logs to CloudWatch Logs
    }
  }

  setting {
    name  = "containerInsights"
    value = "disabled"
  }

  tags = local.tags
}

resource "aws_ecs_cluster_capacity_providers" "apps" {
  cluster_name = aws_ecs_cluster.apps.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1   // how many tasks, at a minimum, to run on the specified capacity provider
    weight            = 100 // the relative percentage of the total number of launched tasks that should use the specified capacity provider
    capacity_provider = "FARGATE"
  }
  default_capacity_provider_strategy {
    base              = 0
    weight            = 0
    capacity_provider = "FARGATE_SPOT"
  }
}
