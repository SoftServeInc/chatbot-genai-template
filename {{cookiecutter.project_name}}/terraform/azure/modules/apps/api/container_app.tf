locals {
  container_app_secret_values = concat(
    [
      {
        name  = "acr-password"
        value = local.acr_credentials.password
      },
      {
        # This workaround is required because the azurerm_container_app resource does not support mounting secrets to the container directly from the key vault
        # See: https://github.com/hashicorp/terraform-provider-azurerm/issues/21739
        # (Hopefully it will be resolved soon...)
        name  = "db-password"
        value = data.azurerm_key_vault_secret.db_password.value
      },
      {%- if cookiecutter.auth == "keycloak" %}
      {
        name  = "keycloak-client-secret"
        value = module.keycloak.api_client.secret_value
      },
      {%- endif %}
    ],
    [
      # Secrets cannot be removed from the service once added, attempting to do so will result in an error.
      # Their values may be zeroed, i.e. set to "", but the named secret must persist.
      # This is due to a technical limitation on the service which causes the service to become unmanageable.
      # See this issue for more details: https://github.com/microsoft/azure-container-apps/issues/395
      for secret in local.container_app_secrets : {
        name  = secret.container_app_secret_name
        value = secret.name == "" ? "" : data.azurerm_key_vault_secret.container_app_secret[secret.env_var_name].value
      }
    ]
  )

  container_app_container_secrets = concat(
    [
      {
        env_var_name              = "DB_PASSWORD"
        container_app_secret_name = "db-password"
      },
      {%- if cookiecutter.auth == "keycloak" %}
      {
        env_var_name              = "AUTH_KEYCLOAK_CLIENT_SECRET"
        container_app_secret_name = "keycloak-client-secret"
      },
      {%- endif %}
    ],
    local.container_app_secrets
  )

  container_app_container_envs = concat(
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
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.this.fqdn
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
    ],
    local.container_app_envs
  )
}

resource "azurerm_container_app" "server" {
  name                         = local.container_app_name
  container_app_environment_id = local.container_app_environment_id
  resource_group_name          = local.resource_group_name
  revision_mode                = "Single"

  ingress {
    transport                  = "http"
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  lifecycle {
    # Required to not delete the custom domain created via azapi
    # in the "dns.tf" file by "azapi_update_resource.custom_domain" resource
    ignore_changes = [ingress[0].custom_domain]
  }

  registry {
    server               = local.acr_server
    username             = local.acr_credentials.username
    password_secret_name = "acr-password"
  }

  dynamic "secret" {
    for_each = local.container_app_secret_values
    content {
      name  = secret.value.name
      value = secret.value.value
    }
  }

  template {
    min_replicas = local.container_app_server_min_replicas
    max_replicas = local.container_app_server_max_replicas

    dynamic "custom_scale_rule" {
      for_each = local.container_app_server_max_replicas > local.container_app_server_min_replicas ? [1] : []
      content {
        name             = "sr-cpu"
        custom_rule_type = "cpu"

        metadata = {
          type  = "Utilization"
          value = 75
        }
      }
    }

    container {
      name   = "main"
      image  = local.container_app_image
      cpu    = local.container_app_server_cpu
      memory = local.container_app_server_memory

      liveness_probe {
        transport = "HTTP"
        path      = "/"
        port      = 3000

        initial_delay    = 30
        interval_seconds = 15
        timeout          = 5

        failure_count_threshold = 3
      }

      readiness_probe {
        transport = "HTTP"
        path      = "/"
        port      = 3000

        interval_seconds = 10
        timeout          = 5

        failure_count_threshold = 3
        success_count_threshold = 1
      }

      dynamic "env" {
        for_each = local.container_app_container_envs
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      dynamic "env" {
        for_each = local.container_app_container_secrets
        content {
          name        = env.value.env_var_name
          secret_name = env.value.container_app_secret_name
        }
      }
    }
  }
}

