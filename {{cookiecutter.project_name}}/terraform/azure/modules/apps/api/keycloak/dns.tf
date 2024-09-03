data "azurerm_dns_zone" "primary" {
  count = local.dns_zone_name != "" ? 1 : 0
  name  = local.dns_zone_name

  resource_group_name = local.dns_zone_resource_group_name
}

resource "azurerm_dns_cname_record" "this" {
  count               = local.dns_zone_name != "" && local.domain_name != "" ? 1 : 0
  name                = local.subdomain_name
  zone_name           = data.azurerm_dns_zone.primary[0].name
  resource_group_name = data.azurerm_dns_zone.primary[0].resource_group_name
  ttl                 = 3600
  record              = azurerm_container_app.this.ingress[0].fqdn

  lifecycle {
    precondition {
      condition     = endswith(local.domain_name, local.dns_zone_name)
      error_message = "When domain_name is specified together with dns_zone_name then the domain_name must be a subdomain of the dns_zone_name"
    }
  }
}

data "azapi_resource" "domain_verification_id" {
  resource_id = local.container_app_environment_id
  type        = "Microsoft.App/managedEnvironments@2023-05-01"

  response_export_values = ["properties.customDomainConfiguration.customDomainVerificationId"]
}

locals {
  domain_verification_id = jsondecode(data.azapi_resource.domain_verification_id.output).properties.customDomainConfiguration.customDomainVerificationId
}

# While it's not absolutely required to add the TXT record, it's highly recommended for security.
# The TXT record is a domain verification ID that helps avoid subdomain takeovers from other App Service apps.
# For custom domains you previously configured without this verification ID, you should protect them from the same risk by adding the verification ID (the TXT record) to your DNS configuration.
# For more information on this common high-severity threat, see: https:#learn.microsoft.com/en-us/azure/security/fundamentals/subdomain-takeover
# So here we add the TXT record to the DNS zone to declare that the subdomain is used by the Container App Environment.
resource "azurerm_dns_txt_record" "this" {
  count               = local.dns_zone_name != "" && local.domain_name != "" ? 1 : 0
  name                = "asuid.${local.subdomain_name}"
  zone_name           = data.azurerm_dns_zone.primary[0].name
  resource_group_name = data.azurerm_dns_zone.primary[0].resource_group_name
  ttl                 = 3600

  record {
    value = local.domain_verification_id
  }
}

resource "time_sleep" "dns_propagation" {
  count           = local.dns_zone_name != "" && local.domain_name != "" ? 1 : 0
  create_duration = "60s"

  depends_on = [
    azurerm_dns_txt_record.this[0],
    azurerm_dns_cname_record.this[0],
  ]

  triggers = {
    domain_name            = local.domain_name
    domain_verification_id = local.domain_verification_id
  }
}

# ----------
# Unfortunattely, azurerm can't create a managed TLS certificate, see: https:#github.com/hashicorp/terraform-provider-azurerm/issues/21866
# The resources below are the workaround:

# Declare custom domain associated with the container app (but not bound with a certificate yet...)
resource "azapi_update_resource" "custom_domain" {
  count       = local.domain_name != "" ? 1 : 0
  type        = "Microsoft.App/containerApps@2023-05-01"
  resource_id = azurerm_container_app.this.id

  body = jsonencode({
    properties = {
      configuration = {
        secrets = local.container_app_secret_values
        ingress = {
          customDomains = [
            {
              bindingType = "Disabled"
              name        = local.domain_name
            }
          ]
        }
      }
    }
  })

  depends_on = [
    azurerm_container_app.this,
    time_sleep.dns_propagation
  ]
}

# Create a managed TLS certificate for the custom domain withing the container app environment
resource "azapi_resource" "managed_certificate" {
  count     = local.domain_name != "" ? 1 : 0
  type      = "Microsoft.App/ManagedEnvironments/managedCertificates@2023-05-01"
  name      = local.managed_certificate_name
  parent_id = local.container_app_environment_id
  location  = local.region

  body = jsonencode({
    properties = {
      domainControlValidation = "CNAME"
      subjectName             = local.domain_name
    }
  })

  response_export_values = ["*"]

  depends_on = [
    azapi_update_resource.custom_domain
  ]
}

# Bind the custom domain (associated with the container app) with a certificate
resource "azapi_update_resource" "custom_domain_binding" {
  count       = local.domain_name != "" ? 1 : 0
  type        = "Microsoft.App/containerApps@2023-05-01"
  resource_id = azurerm_container_app.this.id

  body = jsonencode({
    properties = {
      configuration = {
        secrets = local.container_app_secret_values
        ingress = {
          customDomains = [
            {
              bindingType   = "SniEnabled",
              name          = local.domain_name
              certificateId = jsondecode(azapi_resource.managed_certificate[0].output).id
            }
          ]
        }
      }
    }
  })

  depends_on = [
    azapi_resource.managed_certificate
  ]
}
