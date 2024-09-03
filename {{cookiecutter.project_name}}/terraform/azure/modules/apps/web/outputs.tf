locals {
  output_domain_name = local.domain_name == "" ? azurerm_cdn_endpoint.this.fqdn : local.domain_name
}

output "subscription_id" {
  value = data.azurerm_client_config.current.subscription_id
}

output "resource_group_name" {
  value = local.resource_group_name
}

output "storage_account_name" {
  value = local.storage_account_name
}

output "cdn_profile_name" {
  value = azurerm_cdn_profile.this.name
}

output "cdn_endpoint_name" {
  value = azurerm_cdn_endpoint.this.name
}

output "domain_name" {
  value = local.output_domain_name
}

output "url" {
  value = "https://${local.output_domain_name}"
}
