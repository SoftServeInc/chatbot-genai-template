include "root" {
  path = find_in_parent_folders()
}

include "env" {
  path           = "${get_terragrunt_dir()}/../../../_env/apps/web.hcl"
  merge_strategy = "deep"
}

inputs = {
  # define environment-specific inputs for 'web' application her
}
