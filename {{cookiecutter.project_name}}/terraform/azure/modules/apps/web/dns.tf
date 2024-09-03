data "azurerm_dns_zone" "primary" {
  count = local.dns_zone_name != "" ? 1 : 0
  name  = local.dns_zone_name

  resource_group_name = local.project_resource_group_name
}

resource "azurerm_cdn_endpoint_custom_domain" "this" {
  count           = local.domain_name != "" ? 1 : 0
  name            = "cd-web"
  cdn_endpoint_id = azurerm_cdn_endpoint.this.id
  host_name       = local.domain_name

  cdn_managed_https {
    certificate_type = "Dedicated"
    protocol_type    = "ServerNameIndication"
    tls_version      = "TLS12"
  }

  depends_on = [azurerm_dns_cname_record.this]
}

resource "azurerm_dns_cname_record" "this" {
  count               = local.dns_zone_name != "" && local.domain_name != "" ? 1 : 0
  name                = local.subdomain_name
  zone_name           = data.azurerm_dns_zone.primary[0].name
  resource_group_name = data.azurerm_dns_zone.primary[0].resource_group_name
  ttl                 = 3600
  target_resource_id  = azurerm_cdn_endpoint.this.id

  lifecycle {
    precondition {
      condition     = endswith(local.domain_name, local.dns_zone_name)
      error_message = "When domain_name is specified together with dns_zone_name then the domain_name must be a subdomain of the dns_zone_name"
    }
  }
}

