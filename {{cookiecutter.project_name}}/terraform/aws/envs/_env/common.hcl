locals {
  // Load the relevant env.hcl file based on where terragrunt was invoked.
  // This works because find_in_parent_folders always works at the context of the child configuration.
  env = read_terragrunt_config(find_in_parent_folders("env.hcl")).locals.env

  // Set to "" if you don't have a domain name yet or if you want to manage the ACM certificates manually, outside of Terraform
  acm_domain_name = "" // "${local.env}.example.com"
}

terraform {
  source = "${path_relative_from_include()}/../../modules/common"
}

inputs = {
  env             = local.env
  acm_domain_name = local.acm_domain_name
}
