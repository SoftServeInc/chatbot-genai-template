# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
resource "aws_ecs_task_definition" "this" {
  family                   = "${var.cluster_name}-${local.app}-task"
  network_mode             = "awsvpc" # Required for Fargate
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "main"
      image     = "quay.io/keycloak/keycloak:${var.image_tag}"
      essential = true

      portMappings = [{
        containerPort = 8080
        hostPort      = 8080
        protocol      = "tcp"
      }]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.cluster_name}-${local.app}"
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "app"
        }
      }

      entryPoint = var.enable_https ? ["/opt/keycloak/bin/kc.sh"] : ["/bin/bash", "-c"]
      command = var.enable_https ? ["start", "--import-realm"] : [
        # Allow HTTP traffic for the master realm
        join(" ", [
          "cd /opt/keycloak/bin;",
          # Wait for Keycloak to start up before configuring it
          "(while ! { exec 3<>/dev/tcp/localhost/8080; echo -e 'GET ${local.hostname_path}/health/ready HTTP/1.1\\r\\nHost: localhost\\r\\nConnection: close\\r\\n\\r\\n' >&3; cat <&3; } 2>/dev/null | grep -q '200 OK'; do echo 'Keycloak is starting...'; sleep 10; done;",
          # Disable SSL for the master realm
          "./kcadm.sh config credentials --server http://localhost:8080${local.hostname_path}/ --realm master --user $KEYCLOAK_ADMIN --password $KEYCLOAK_ADMIN_PASSWORD;",
          "./kcadm.sh update realms/master -s sslRequired=none) &",
          # Start keycloak
          "./kc.sh start --import-realm",
        ])
      ]

      environment = [
        {
          name  = "KC_DB"
          value = "postgres"
        },
        {
          name  = "KC_DB_SCHEMA"
          value = postgresql_schema.keycloak.name
        },
        {
          name  = "KC_DB_USERNAME"
          value = var.db_username
        },
        {
          name  = "KC_DB_URL"
          value = "jdbc:postgresql://${var.db_host}:${var.db_port}/${var.db_name}"
        },
        {
          name  = "KC_LOG_LEVEL"
          value = "INFO"
        },
        {
          name  = "KC_PROXY"
          value = "edge"
        },
        {
          name  = "KC_HEALTH_ENABLED"
          value = "true"
        },
        {
          name  = "KC_METRICS_ENABLED"
          value = "true"
        },
        {
          name  = "KC_HTTP_RELATIVE_PATH"
          value = local.hostname_path # Ensures that Keycloak internally serves its resources under the /keycloak path
        },
        {
          name  = "KC_HOSTNAME"
          value = local.hostname
        },
        {
          name  = "KC_HOSTNAME_PATH"
          value = local.hostname_path # Ensures that Keycloak generates URLs that include the base path.
        },
        {
          name  = "KC_HOSTNAME_STRICT"
          value = var.enable_https ? "true" : "false"
        },
        {
          name  = "KC_HOSTNAME_STRICT_HTTPS"
          value = var.enable_https ? "true" : "false"
        },
        {
          name  = "KC_SSL_REQUIRED"
          value = var.enable_https ? "external" : "none"
        },
        {
          name  = "KC_CACHE"
          value = "local" # disable distributed cache as it is not needed for a single instance
        },
        {
          name  = "KEYCLOAK_CLIENT_ID"
          value = local.api_client_id
        },
        {
          name  = "KEYCLOAK_REALM_NAME"
          value = local.realm_name
        },
        {
          name  = "KEYCLOAK_ADMIN"
          value = "admin"
        },
      ]

      secrets = [
        {
          name      = "KC_DB_PASSWORD"
          valueFrom = var.db_password_secret_id
        },
        {
          name      = "KEYCLOAK_ADMIN_PASSWORD"
          valueFrom = aws_secretsmanager_secret.admin_password.id
        },
        {
          name      = "KEYCLOAK_CLIENT_SECRET"
          valueFrom = aws_secretsmanager_secret.api_client_secret.id
        },
      ],

      mountPoints = [
        {
          sourceVolume  = "realm-import"
          containerPath = "/opt/keycloak/data/import"
          readOnly      = true
        }
      ]

      depends_on = [
        {
          containerName = "realm"
          condition     = "COMPLETE"
        }
      ]
    },
    {
      name      = "realm"
      image     = "bash:3.1.23"
      essential = false
      command = [
        "-c",
        "echo $REALM_JSON | base64 -d - | tee /opt/keycloak/data/import/realm.json"
      ]
      environment = [
        {
          name  = "REALM_JSON"
          value = filebase64("${path.module}/realm.json")
        }
      ]
      mountPoints = [
        {
          sourceVolume  = "realm-import"
          containerPath = "/opt/keycloak/data/import"
        }
      ]
    }
  ])

  volume {
    name = "realm-import"
  }

  tags = local.tags
}

resource "aws_ecs_service" "this" {
  name            = "${var.cluster_name}-${local.app}-service"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  health_check_grace_period_seconds = 180 # Allow Keycloak to start up before health checks begin

  network_configuration {
    subnets          = var.subnets
    security_groups  = [var.security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.this.arn
    container_name   = "main"
    container_port   = 8080
  }

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${var.cluster_name}-${local.app}"
  retention_in_days = var.task_log_retention_in_days

  tags = local.tags
}
