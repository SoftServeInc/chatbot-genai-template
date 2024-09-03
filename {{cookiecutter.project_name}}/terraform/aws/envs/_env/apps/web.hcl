locals {
  // Load the relevant env.hcl file based on where terragrunt was invoked.
  // This works because find_in_parent_folders always works at the context of the child configuration.
  env = read_terragrunt_config(find_in_parent_folders("env.hcl")).locals.env

  // Set to "" if you don't have a domain name yet
  domain_name = "" // "${local.env}.example.com"
}

terraform {
  source = "${path_relative_from_include()}/../../../modules/apps/web"
}

dependency "common" {
  config_path  = "../../common"
  skip_outputs = true
}

inputs = {
  env               = local.env
  domain_name       = local.domain_name
  redirect_to_https = local.domain_name != ""
}
