terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

resource "cloudflare_pages_domain" "this" {
  account_id   = var.account_id
  project_name = var.project_name
  name         = var.domain_name
}
