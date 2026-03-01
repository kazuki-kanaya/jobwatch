data "terraform_remote_state" "acm_apigw" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/10-acm-apigw/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

data "terraform_remote_state" "acm_cognito" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/11-acm-cognito/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

locals {
  apigw_validation_records = {
    for dvo in data.terraform_remote_state.acm_apigw.outputs.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      content = dvo.resource_record_value
      ttl     = 1
      proxied = false
      comment = "Managed by Terraform: API Gateway ACM validation"
    }
  }

  cognito_validation_records = {
    for dvo in data.terraform_remote_state.acm_cognito.outputs.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      type    = dvo.resource_record_type
      content = dvo.resource_record_value
      ttl     = 1
      proxied = false
      comment = "Managed by Terraform: Cognito ACM validation"
    }
  }

  validation_records = merge(local.apigw_validation_records, local.cognito_validation_records)
}

module "dns" {
  source = "../../../../modules/cloudflare/dns"

  zone_id = var.cloudflare_zone_id
  records = local.validation_records
}
