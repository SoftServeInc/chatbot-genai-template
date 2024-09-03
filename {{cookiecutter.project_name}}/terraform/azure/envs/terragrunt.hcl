locals {
  // Load the relevant env.hcl file based on where terragrunt was invoked.
  // This works because find_in_parent_folders always works at the context of the child configuration.
  region          = "eastus"
  subscription_id = "11111111-1111-1111-1111-111111111111" // FIXME: replace with your Azure subscription ID
  project         = "{{ cookiecutter.project_name }}"

  project_resource_group_name            = "rg-${local.project}"           # the resource group to which non-environment-specific resources belong to, like the storage account for tfstate, DNS zone, etc.
  project_storage_account_name           = replace(local.project, "-", "") # the storage account name must be lowercase and can contain only alphanumeric characters.
  project_storage_tfstate_container_name = "terraform-state"

  // Set to "" if you don't have a domain name yet or if the DNS zone is managed outside of Azure.
  // It must be already existing Azure DNS zone belonging to the same subscription as the resource group whose name is specified in project_resource_group_name.
  dns_zone_name = "" // "example.com"
}

remote_state {
  backend = "azurerm"

  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }

  config = {
    subscription_id      = local.subscription_id
    resource_group_name  = local.project_resource_group_name
    storage_account_name = local.project_storage_account_name
    container_name       = local.project_storage_tfstate_container_name
    key                  = "${path_relative_to_include()}/terraform.tfstate"
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "azurerm" {
  features {}

  subscription_id = "${local.subscription_id}"
}

provider "azapi" {}
EOF
}

generate "client_config" {
  path      = "client_config.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
data "azurerm_client_config" "current" {}
EOF
}

generate "terraform" {
  path      = "versions.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_version = ">= 1.6.5, < 2.0.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~> 1.11.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
      version = "~> 1.21"
    }
  }
}
EOF
}

# terraform {
#   # Force Terraform to keep trying to acquire a lock for
#   # up to 20 minutes if someone else already has the lock
#   extra_arguments "retry_lock" {
#     commands  = get_terraform_commands_that_need_locking()
#     arguments = [
#       "-lock-timeout=20m"
#     ]
#   }
# }

inputs = {
  region  = local.region
  project = local.project

  project_resource_group_name            = local.project_resource_group_name
  project_storage_account_name           = local.project_storage_account_name
  project_storage_tfstate_container_name = local.project_storage_tfstate_container_name

  dns_zone_name = local.dns_zone_name
}
