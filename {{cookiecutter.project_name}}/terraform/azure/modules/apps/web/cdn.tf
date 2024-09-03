resource "azurerm_cdn_profile" "this" {
  name                = local.cdn_profile_name
  location            = local.region
  resource_group_name = local.resource_group_name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "this" {
  name                = local.cdn_endpoint_name
  profile_name        = azurerm_cdn_profile.this.name
  location            = azurerm_cdn_profile.this.location
  resource_group_name = local.resource_group_name
  origin_host_header  = azurerm_storage_account.this.primary_web_host

  querystring_caching_behaviour = "IgnoreQueryString"

  origin {
    name      = "origin-storage"
    host_name = azurerm_storage_account.this.primary_web_host
  }

  delivery_rule {
    name  = "EnforceHTTPS"
    order = "1"

    request_scheme_condition {
      operator     = "Equal"
      match_values = ["HTTP"]
    }

    url_redirect_action {
      redirect_type = "Found"
      protocol      = "Https"
    }
  }

  delivery_rule {
    name  = "RewriteToIndex"
    order = "2"

    // https://stackoverflow.com/a/59585005
    url_file_extension_condition {
      negate_condition = false
      operator         = "LessThanOrEqual"
      match_values     = ["0"]
    }

    // rewrite all paths without extension to index.html
    url_rewrite_action {
      source_pattern          = "/"
      destination             = "/index.html"
      preserve_unmatched_path = false
    }
  }
}
