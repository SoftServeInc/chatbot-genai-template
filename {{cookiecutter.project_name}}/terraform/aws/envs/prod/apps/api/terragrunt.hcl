include "root" {
  path = find_in_parent_folders()
}

include "env" {
  path           = "${get_terragrunt_dir()}/../../../_env/apps/api.hcl"
  merge_strategy = "deep"
}

inputs = {
  # define environment-specific inputs for 'api' application here
  db_instance  = "db.t4g.xlarge"
  db_is_public = true

  task_log_retention_in_days = 60

  task_server_cpu       = 1024
  task_server_memory    = 2048
  task_server_count_min = 2
  task_server_count_max = 3

  {%- if cookiecutter.auth == "keycloak" %}

  task_keycloak_cpu    = 2048
  task_keycloak_memory = 4096

  {%- endif %}
}
