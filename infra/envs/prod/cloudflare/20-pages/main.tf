module "pages_site" {
  source = "../../../../modules/cloudflare/pages"

  account_id   = var.cloudflare_account_id
  project_name = var.site_project_name
}

module "pages_dashboard" {
  source = "../../../../modules/cloudflare/pages"

  account_id   = var.cloudflare_account_id
  project_name = var.dashboard_project_name
}
