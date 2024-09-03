include "root" {
  path = find_in_parent_folders()
}

include "env" {
  path           = "${get_terragrunt_dir()}/../../../_env/apps/api.hcl"
  merge_strategy = "deep"
}

inputs = {
  // define environment-specific inputs for 'api' application here
  db_tier      = "db-f1-micro"
  db_is_public = true

  run_server_limit_cpu    = "1"
  run_server_limit_memory = "1024Mi"
  run_server_count_min    = 1
  run_server_count_max    = 1

  {%- if cookiecutter.auth == "keycloak" %}

  run_keycloak_limit_cpu    = "1"
  run_keycloak_limit_memory = "2048Mi"

  {%- endif %}
}
