data "aws_secretsmanager_random_password" "admin_password" {
  password_length     = 24
  exclude_punctuation = true
  include_space       = false
}

resource "aws_secretsmanager_secret" "admin_password" {
  name                    = "/${local.resource_basename}/${local.app}/admin-password"
  description             = "Admin passsword for '${local.app}' application"
  recovery_window_in_days = 7

  # https://github.com/hashicorp/terraform-provider-aws/issues/29459
  # tags = local.tags
}

resource "aws_secretsmanager_secret_version" "admin_password" {
  secret_id     = aws_secretsmanager_secret.admin_password.id
  secret_string = data.aws_secretsmanager_random_password.admin_password.random_password

  lifecycle {
    ignore_changes = [secret_string]
  }
}

data "aws_secretsmanager_secret_version" "admin_password" {
  secret_id = aws_secretsmanager_secret.admin_password.id

  depends_on = [
    aws_secretsmanager_secret_version.admin_password
  ]
}

data "aws_secretsmanager_random_password" "api_client_secret" {
  password_length     = 32
  exclude_punctuation = true
  include_space       = false
}

resource "aws_secretsmanager_secret" "api_client_secret" {
  name                    = "/${local.resource_basename}/${local.app}/api-client-secret"
  description             = "Oauth 2.0 client secret for API client"
  recovery_window_in_days = 7

  # https://github.com/hashicorp/terraform-provider-aws/issues/29459
  # tags = local.tags
}

resource "aws_secretsmanager_secret_version" "api_client_secret" {
  secret_id     = aws_secretsmanager_secret.api_client_secret.id
  secret_string = data.aws_secretsmanager_random_password.api_client_secret.random_password

  lifecycle {
    ignore_changes = [secret_string]
  }
}
