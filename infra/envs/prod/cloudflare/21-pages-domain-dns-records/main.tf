data "terraform_remote_state" "pages" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/cloudflare/20-pages/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

locals {
  pages_domain_records = {
    site = {
      name    = var.site_domain_name
      type    = "CNAME"
      content = data.terraform_remote_state.pages.outputs.site_pages_subdomain
      ttl     = 1
      proxied = var.pages_domain_record_proxied
      comment = "Managed by Terraform: Pages site custom domain"
    }
    dashboard = {
      name    = var.dashboard_domain_name
      type    = "CNAME"
      content = data.terraform_remote_state.pages.outputs.dashboard_pages_subdomain
      ttl     = 1
      proxied = var.pages_domain_record_proxied
      comment = "Managed by Terraform: Pages dashboard custom domain"
    }
  }
}

module "pages_domain_site" {
  source = "../../../../modules/cloudflare/pages-domain"

  account_id   = var.cloudflare_account_id
  project_name = data.terraform_remote_state.pages.outputs.site_pages_project_name
  domain_name  = var.site_domain_name
}

module "pages_domain_dashboard" {
  source = "../../../../modules/cloudflare/pages-domain"

  account_id   = var.cloudflare_account_id
  project_name = data.terraform_remote_state.pages.outputs.dashboard_pages_project_name
  domain_name  = var.dashboard_domain_name
}

module "dns" {
  source = "../../../../modules/cloudflare/dns"
  providers = {
    cloudflare = cloudflare.dns
  }

  zone_id = var.cloudflare_zone_id
  records = local.pages_domain_records
}
