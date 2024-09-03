locals {
  task_container_secrets = concat(
    [
      {
        name      = "DB_PASSWORD"
        valueFrom = aws_secretsmanager_secret.db_password.id
      },
      {%- if cookiecutter.auth == "keycloak" %}
      {
        name      = "AUTH_KEYCLOAK_CLIENT_SECRET"
        valueFrom = module.keycloak.api_client.secret_secret_id
      },
      {%- endif %}
    ],
    [
      for param in local.task_params : {
        name      = param.env_var_name
        valueFrom = "arn:aws:ssm:${local.region}:${local.account_id}:parameter${startswith(param.name, "/") ? param.name : "/${param.name}"}"
      }
    ],
    [
      for i, secret in local.task_secrets : {
        name      = secret.env_var_name
        valueFrom = "${data.aws_secretsmanager_secret.task_secret[i].arn}${(secret.key != "" ? ":${secret.key}::" : "")}"
      }
    ]
  )

  task_container_environment = concat(
    [
      {%- if cookiecutter.auth == "keycloak" %}
      {
        name  = "AUTH_KEYCLOAK_CLIENT_ID"
        value = module.keycloak.api_client.id
      },
      {
        name  = "AUTH_KEYCLOAK_REALM_NAME"
        value = module.keycloak.realm_name
      },
      {
        name  = "AUTH_KEYCLOAK_SERVER_URL"
        value = module.keycloak.url
      },
      {%- endif %}
      {
        name  = "DB_NAME"
        value = local.db_name
      },
      {
        name  = "DB_USERNAME"
        value = local.db_username
      },
      {
        name  = "DB_HOST"
        value = aws_db_instance.database.address
      },
      {
        name  = "DB_PORT"
        value = local.db_port
      },
      {
        name  = "DB_NAME"
        value = local.db_name
      },
      {
        name  = "DB_USERNAME"
        value = local.db_username
      },
      {
        name  = "DB_HOST"
        value = aws_db_instance.database.address
      },
      {
        name  = "DB_PORT"
        value = local.db_port
      },
    ],
    local.task_envs
  )
}

# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
resource "aws_ecs_task_definition" "server" {
  family                   = "${local.cluster_name}-${local.app}-task"
  depends_on               = [aws_db_instance.database]
  network_mode             = "awsvpc" # Required for Fargate
  requires_compatibilities = ["FARGATE"]
  cpu                      = local.task_server_cpu
  memory                   = local.task_server_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "main"
      image     = local.task_image
      essential = true

      portMappings = [{
        containerPort = 3000
        hostPort      = 3000
        protocol      = "tcp"
      }]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${local.cluster_name}-${local.app}"
          "awslogs-region"        = local.region
          "awslogs-stream-prefix" = "app"
        }
      }

      environment = local.task_container_environment
      secrets     = local.task_container_secrets
    },
  ])

  tags = local.tags
}

resource "aws_ecs_service" "server" {
  name            = "${local.cluster_name}-${local.app}-service"
  cluster         = local.cluster_id
  task_definition = aws_ecs_task_definition.server.arn
  desired_count   = local.task_server_count_min
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = local.public_subnets
    security_groups  = [local.sg_id_cluster]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.this.arn
    container_name   = "main"
    container_port   = 3000
  }

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${local.cluster_name}-${local.app}"
  retention_in_days = var.task_log_retention_in_days

  tags = local.tags
}
