output "alb_target_group_arn" {
  value       = aws_alb_target_group.this.arn
  description = "Keycloak ALB Target Group ARN"
}

output "url" {
  value       = "${var.enable_https ? "https" : "http"}://${local.hostname}${local.hostname_path}/"
  description = "Keycloak URL address"
}

output "realm_name" {
  value       = local.realm_name
  description = "Keycloak realm name"
}

output "api_client" {
  value = {
    id               = local.api_client_id
    secret_secret_id = aws_secretsmanager_secret.api_client_secret.id
  }

  description = "Keycloak API client ID and secret"
}

output "admin" {
  value = {
    username           = "admin"
    password_secret_id = aws_secretsmanager_secret.admin_password.id
  }

  description = "Keycloak admin user credentials"
}
