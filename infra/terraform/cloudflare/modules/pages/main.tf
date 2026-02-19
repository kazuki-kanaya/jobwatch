terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

resource "cloudflare_pages_project" "this" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = "main"

  deployment_configs = {
    production = {
      env_vars = {
        API_ORIGIN = {
          type  = "plain_text"
          value = var.api_origin
        }
      }
    }
    preview = {
      env_vars = {
        API_ORIGIN = {
          type  = "plain_text"
          value = var.api_origin
        }
      }
    }
  }
}
