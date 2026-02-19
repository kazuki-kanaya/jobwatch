module "pages" {
  source = "./modules/pages"

  account_id   = var.cloudflare_account_id
  project_name = var.project_name
}
