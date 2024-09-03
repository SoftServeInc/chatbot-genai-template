include "root" {
  path = find_in_parent_folders()
}

include "env" {
  path           = "${get_terragrunt_dir()}/../../../_env/apps/api.hcl"
  merge_strategy = "deep"
}

inputs = {
  # define environment-specific inputs for 'api' application here
  db_sku_name  = "B_Standard_B4ms"
  db_is_public = true

  container_app_server_cpu          = 1
  container_app_server_memory       = "2Gi"
  container_app_server_min_replicas = 2
  container_app_server_max_replicas = 3

  {%- if cookiecutter.auth == "keycloak" %}

  container_app_keycloak_cpu    = "2"
  container_app_keycloak_memory = "4Gi"

  {%- endif %}
}
