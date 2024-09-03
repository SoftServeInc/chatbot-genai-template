data "terraform_remote_state" "common" {
  backend = "azurerm"

  config = {
    resource_group_name  = local.project_resource_group_name
    storage_account_name = local.project_storage_account_name
    container_name       = local.project_storage_tfstate_container_name
    key                  = "${local.env}/common/terraform.tfstate"
  }
}


