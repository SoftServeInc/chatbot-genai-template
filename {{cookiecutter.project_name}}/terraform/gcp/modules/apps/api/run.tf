locals {
  run_service_container_envs = concat(
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
        name  = "GCP_PROJECT"
        value = local.project_id
      },
      {
        name  = "GCP_LOCATION"
        value = local.region
      },
      {
        name  = "DB_INSTANCE_CONNECTION_NAME"
        value = google_sql_database_instance.database.connection_name
      },
      {
        name  = "DB_USERNAME"
        value = local.db_username
      },
      {
        name  = "DB_NAME"
        value = local.db_name
      },
    ],
    local.run_envs
  )

  run_service_container_secrets = concat(
    [
      {
        env_var_name = "DB_PASSWORD"
        name         = google_secret_manager_secret.db_password.name
      },
      {%- if cookiecutter.auth == "keycloak" %}
      {
        env_var_name = "AUTH_KEYCLOAK_CLIENT_SECRET"
        name         = module.keycloak.api_client.secret_secret_name
      },
      {%- endif %}
    ],
    local.run_secrets
  )
}

resource "google_project_service" "cloudrun_api" {
  service = "run.googleapis.com"

  # services that are enabled and which depend on this service should also be disabled when this service is destroyed
  disable_dependent_services = true

  # do not disable the API when this resource is destroyed
  disable_on_destroy = false
}

resource "google_cloud_run_v2_service" "server" {
  name     = local.run_name
  location = local.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = local.run_service_account

    scaling {
      min_instance_count = local.run_server_count_min
      max_instance_count = local.run_server_count_max
    }

    vpc_access {
      connector = local.vpc_connector_id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    volumes {
      name = "cloudsql"

      cloud_sql_instance {
        instances = [google_sql_database_instance.database.connection_name]
      }
    }

    containers {
      image = local.run_image

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = local.run_server_limit_cpu    # https://cloud.google.com/run/docs/configuring/services/cpu
          memory = local.run_server_limit_memory # https://cloud.google.com/run/docs/configuring/services/memory-limits
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      startup_probe {
        failure_threshold     = 2
        initial_delay_seconds = 10
        period_seconds        = 10
        timeout_seconds       = 5

        http_get {
          path = "/"
        }
      }

      liveness_probe {
        failure_threshold     = 2
        initial_delay_seconds = 10
        period_seconds        = 15
        timeout_seconds       = 5

        http_get {
          path = "/"
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
  depends_on = [
    google_project_service.secretmanager_api,
    google_project_service.cloudrun_api,
    google_project_service.sqladmin_api,
    google_project_iam_member.vertex_ai_compute_access,
    google_project_iam_member.secrets_compute_access,
  ]
}


# !!! IMPORTANT !!! We intentionally commented out the following block of code, because we don't want to use Cloud Run domain mapping, as this feature provides limited availability, requires domain ownership verification, manual DNS configuration, and may take up to 24 hours to propagate.
# Instead, we use a global external Application Load Balancer - the officially recommended way to set up a custom domain name.
# ------------------------------------------------------------------------
#
# # https://cloud.google.com/run/docs/mapping-custom-domains#map
# #
# # Make sure you follow the instructions to verify your domain ownership:
# # https://cloud.google.com/run/docs/mapping-custom-domains#add-verified
# # https://support.google.com/webmasters/answer/9008080
# #
# # In case your DNS is not managed by Google Cloud Domains, the ownership of the domain needs to be verified adding a TXT record on your DNS configuration.
# # This verification can be done following the steps from this documentation: https://cloud.google.com/identity/docs/verify-domain-txt
# #
# # Also, don't forget to add the DNS records for your custom domain:
# # https://cloud.google.com/run/docs/mapping-custom-domains#dns_update
#
# resource "google_cloud_run_domain_mapping" "server" {
#   count    = local.domain_name != "" ? 1 : 0
#   name     = local.domain_name
#   location = google_cloud_run_v2_service.server.location

#   metadata {
#     namespace = local.project_id
#   }

#   spec {
#     route_name = google_cloud_run_v2_service.server.name
#   }
# }
