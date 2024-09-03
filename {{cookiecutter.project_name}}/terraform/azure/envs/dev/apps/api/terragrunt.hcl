include "root" {
  path = find_in_parent_folders()
}

include "env" {
  path           = "${get_terragrunt_dir()}/../../../_env/apps/api.hcl"
  merge_strategy = "deep"
}

inputs = {
  # define environment-specific inputs for 'api' application here
  db_sku_name  = "B_Standard_B1ms"
  db_is_public = true

  container_app_server_cpu          = 0.5
  container_app_server_memory       = "1Gi"
  container_app_server_min_replicas = 1
  container_app_server_max_replicas = 1

  {%- if cookiecutter.auth == "keycloak" %}

  container_app_keycloak_cpu    = "1"
  container_app_keycloak_memory = "2Gi"

  {%- endif %}
}
