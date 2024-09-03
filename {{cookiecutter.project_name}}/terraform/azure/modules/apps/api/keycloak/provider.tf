terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
    azapi = {
      source = "azure/azapi"
    }
    random = {
      source = "hashicorp/random"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
    }
  }
}
