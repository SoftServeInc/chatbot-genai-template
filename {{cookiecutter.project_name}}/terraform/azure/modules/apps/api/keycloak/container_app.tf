locals {
  container_app_secret_values = [
    {
      name  = "db-password"
      value = var.db_password
    },
    {
      name  = "admin-password"
      value = data.azurerm_key_vault_secret.admin_password.value
    },
    {
      name  = "client-secret"
      value = data.azurerm_key_vault_secret.api_client_secret.value
    },
  ]
}

resource "azurerm_container_app" "this" {
  name                         = local.container_app_name
  container_app_environment_id = local.container_app_environment_id
  resource_group_name          = local.resource_group_name
  revision_mode                = "Single"

  ingress {
    transport                  = "http"
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8080

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

  dynamic "secret" {
    for_each = local.container_app_secret_values
    content {
      name  = secret.value.name
      value = secret.value.value
    }
  }

  template {
    min_replicas = 1
    max_replicas = 1

    container {
      name   = "main"
      image  = "quay.io/keycloak/keycloak:${var.image_tag}"
      cpu    = var.container_app_cpu
      memory = var.container_app_memory

      command = ["/bin/bash", "-c"]
      args = [
        join(" ", [
          # Decode the realm JSON and write it to the realm import directory
          "mkdir -p /opt/keycloak/data/import;",
          "echo $KC_REALM_JSON | base64 -d - > /opt/keycloak/data/import/realm.json;",
          # Go to the Keycloak bin directory
          "cd /opt/keycloak/bin;",
          # Start keycloak
          "./kc.sh start --import-realm",
        ])
      ]

      # Uncommend when intial delay for startup probe is supported
      # https://github.com/hashicorp/terraform-provider-azurerm/issues/24845
      #
      # startup_probe {
      #   transport = "HTTP"
      #   path      = "${local.hostname_path}/health/ready"
      #   port      = 8080
      #
      #   initial_delay    = 60
      #   interval_seconds = 20
      #   timeout          = 5
      #
      #   failure_count_threshold = 2
      # }

      liveness_probe {
        transport = "HTTP"
        path      = "${local.hostname_path}/health/ready"
        port      = 8080

        initial_delay    = 60
        interval_seconds = 20
        timeout          = 5

        failure_count_threshold = 2
      }

      env {
        name  = "KC_DB"
        value = "postgres"
      }

      env {
        name  = "KC_DB_SCHEMA"
        value = postgresql_schema.keycloak.name
      }

      env {
        name  = "KC_DB_USERNAME"
        value = var.db_username
      }

      env {
        name  = "KC_DB_URL"
        value = "jdbc:postgresql://${var.db_host}:${var.db_port}/${var.db_name}"
      }

      env {
        name  = "KC_LOG_LEVEL"
        value = "INFO"
      }

      env {
        name  = "KC_PROXY"
        value = "edge"
      }

      env {
        name  = "KC_HEALTH_ENABLED"
        value = "true"
      }

      env {
        name  = "KC_METRICS_ENABLED"
        value = "true"
      }

      env {
        name  = "KC_HTTP_RELATIVE_PATH"
        value = local.hostname_path # Ensures that Keycloak internally serves its resources from the base path
      }

      env {
        name  = "KC_HOSTNAME"
        value = local.hostname
      }

      env {
        name  = "KC_HOSTNAME_PATH"
        value = local.hostname_path # Ensures that Keycloak generates URLs that include the base path.
      }

      env {
        name  = "KC_HOSTNAME_STRICT"
        value = var.hostname != "" ? "true" : "false"
      }

      env {
        name  = "KC_HOSTNAME_STRICT_HTTPS"
        value = var.hostname != "" ? "true" : "false"
      }

      env {
        name  = "KC_SSL_REQUIRED"
        value = "external"
      }

      env {
        name  = "KC_CACHE"
        value = "local" # disable distributed cache as it is not needed for a single instance
      }

      env {
        name  = "KEYCLOAK_CLIENT_ID"
        value = local.api_client_id
      }

      env {
        name  = "KEYCLOAK_REALM_NAME"
        value = local.realm_name
      }

      env {
        name  = "KEYCLOAK_ADMIN"
        value = "admin"
      }

      env {
        name  = "KC_REALM_JSON"
        value = filebase64("${path.module}/realm.json")
      }

      env {
        name        = "KC_DB_PASSWORD"
        secret_name = "db-password"
      }

      env {
        name        = "KEYCLOAK_ADMIN_PASSWORD"
        secret_name = "admin-password"
      }

      env {
        name        = "KEYCLOAK_CLIENT_SECRET"
        secret_name = "client-secret"
      }
    }
  }
}
