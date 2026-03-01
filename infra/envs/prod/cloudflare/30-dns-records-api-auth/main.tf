data "terraform_remote_state" "apigw_domain" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/30-domain-apigw/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

data "terraform_remote_state" "cognito_domain" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/31-domain-cognito/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

locals {
  api_record = {
    api = {
      name    = var.api_domain_name
      type    = "CNAME"
      content = data.terraform_remote_state.apigw_domain.outputs.apigw_domain_target
      ttl     = 1
      proxied = var.api_record_proxied
      comment = "Managed by Terraform: API Gateway custom domain"
    }
  }

  cognito_record = var.cognito_auth_domain_name != null && data.terraform_remote_state.cognito_domain.outputs.cognito_custom_domain_cloudfront_distribution != null ? {
    cognito_auth = {
      name    = var.cognito_auth_domain_name
      type    = "CNAME"
      content = data.terraform_remote_state.cognito_domain.outputs.cognito_custom_domain_cloudfront_distribution
      ttl     = 1
      proxied = false
      comment = "Managed by Terraform: Cognito custom domain"
    }
  } : {}
}

module "dns" {
  source = "../../../../modules/cloudflare/dns"

  zone_id = var.cloudflare_zone_id
  records = merge(local.api_record, local.cognito_record)
}
