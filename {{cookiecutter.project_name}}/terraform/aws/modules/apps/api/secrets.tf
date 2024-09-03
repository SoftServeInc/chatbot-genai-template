data "aws_secretsmanager_secret" "task_secret" {
  count = length(local.task_secrets)
  name  = local.task_secrets[count.index].name
}

data "aws_secretsmanager_random_password" "db_password" {
  password_length     = 24
  exclude_punctuation = true
  include_space       = false
}

resource "aws_secretsmanager_secret" "db_password" {
  name                    = "/${local.resource_basename}/${local.app}/db-password"
  description             = "Database password for '${local.app}' application"
  recovery_window_in_days = 7

  # https://github.com/hashicorp/terraform-provider-aws/issues/29459
  # tags = local.tags
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = data.aws_secretsmanager_random_password.db_password.random_password

  lifecycle {
    ignore_changes = [secret_string]
  }
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id

  depends_on = [
    aws_secretsmanager_secret_version.db_password
  ]
}
