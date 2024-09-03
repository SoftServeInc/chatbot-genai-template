locals {
  run_service_container_envs = [
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
    {
      name  = "KC_REALM_JSON"
      value = filebase64("${path.module}/realm.json")
    },
  ]

  run_service_container_secrets = [
    {
      env_var_name = "KC_DB_PASSWORD"
      name         = var.db_password_secret_name
    },
    {
      env_var_name = "KEYCLOAK_ADMIN_PASSWORD"
      name         = google_secret_manager_secret.admin_password.name
    },
    {
      env_var_name = "KEYCLOAK_CLIENT_SECRET"
      name         = google_secret_manager_secret.api_client_secret.name
    },
  ]
}

resource "google_cloud_run_v2_service" "this" {
  name     = local.run_name
  location = local.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = local.run_service_account

    scaling {
      min_instance_count = 1
      max_instance_count = 1
    }

    vpc_access {
      connector = var.vpc_connector_id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      name  = "main"
      image = "docker.io/keycloak/keycloak:${var.image_tag}"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.run_limit_cpu    # https://cloud.google.com/run/docs/configuring/services/cpu
          memory = var.run_limit_memory # https://cloud.google.com/run/docs/configuring/services/memory-limits
        }
      }

      command = ["/bin/bash", "-c"]
      args    = var.enable_https ? [
        join(" ", [
          # Decode the realm JSON and write it to the realm import directory
          "mkdir -p /opt/keycloak/data/import;",
          "echo $KC_REALM_JSON | base64 -d - > /opt/keycloak/data/import/realm.json;",
          # Go to the Keycloak bin directory
          "cd /opt/keycloak/bin;",
          # Start keycloak
          "./kc.sh start --import-realm",
        ])
      ] : [
        # Allow HTTP traffic for the master realm
        join(" ", [
          # Decode the realm JSON and write it to the realm import directory
          "mkdir -p /opt/keycloak/data/import;",
          "echo $KC_REALM_JSON | base64 -d - > /opt/keycloak/data/import/realm.json;",
          # Go to the Keycloak bin directory
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

      startup_probe {
        failure_threshold     = 2
        initial_delay_seconds = 180
        period_seconds        = 10
        timeout_seconds       = 5

        http_get {
          path = "${local.hostname_path}/health/ready"
        }
      }

      liveness_probe {
        failure_threshold     = 2
        initial_delay_seconds = 180
        period_seconds        = 20
        timeout_seconds       = 5

        http_get {
          path = "${local.hostname_path}/health/ready"
        }
      }

      dynamic "env" {
        for_each = local.run_service_container_envs
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      dynamic "env" {
        for_each = local.run_service_container_secrets
        content {
          name = env.value.env_var_name
          value_source {
            secret_key_ref {
              secret  = env.value.name
              version = "latest"
            }
          }
        }
      }
    }
  }

  client = "terraform"
}
