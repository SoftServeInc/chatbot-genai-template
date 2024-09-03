data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    sid = "1"

    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "ecs-tasks.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "ecs_execution_role" {
  name               = "${var.cluster_name}-${local.app}-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  ]

  inline_policy {
    name = "${var.cluster_name}-${local.app}-ecs-execution-role-policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "secretsmanager:GetSecretValue"
          ]
          Resource = [
            "arn:aws:secretsmanager:${local.region}:${local.account_id}:secret:*"
          ]
        },
        {
          Effect = "Allow"
          Action = [
            "kms:Decrypt"
          ]
          Resource = [
            "arn:aws:kms:${local.region}:${local.account_id}:key/*"
          ]
        }
      ]
    })
  }

  tags = local.tags
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "${var.cluster_name}-${local.app}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json

  inline_policy {
    name = "${var.cluster_name}-${local.app}-ecs-task-role-policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect   = "Deny"
          Action   = "iam:*"
          Resource = "*"
        },
        {
          Effect = "Allow"
          Action = "sts:AssumeRole"
          Resource = [
            "arn:aws:iam::${var.account_id}:role/*"
          ]
        },
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogStream",
            "logs:DescribeLogGroups",
            "logs:DescribeLogStreams",
            "logs:PutLogEvents",
          ]
          Resource = "*"
        },
      ]
    })
  }

  tags = local.tags
}
