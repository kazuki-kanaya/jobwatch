data "terraform_remote_state" "apigw_domain" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/30-domain-apigw/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

module "pages_site" {
  source = "../../../../modules/cloudflare/pages"

  account_id   = var.cloudflare_account_id
  project_name = var.site_project_name
}

module "pages_dashboard" {
  source = "../../../../modules/cloudflare/pages"

  account_id   = var.cloudflare_account_id
  project_name = var.dashboard_project_name
  env_vars = {
    API_ORIGIN = {
      type  = "plain_text"
      value = data.terraform_remote_state.apigw_domain.outputs.api_origin
    }
  }
}
