data "terraform_remote_state" "acm_apigw" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/10-acm-apigw/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

data "terraform_remote_state" "core" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/20-core/terraform.tfstate"
    region  = var.terraform_state_region
    profile = var.terraform_state_profile
  }
}

locals {
  validation_record_fqdns = [
    for dvo in data.terraform_remote_state.acm_apigw.outputs.domain_validation_options : dvo.resource_record_name
  ]
}

module "apigw_custom_domain" {
  source = "../../../../modules/aws/apigw-domain"

  custom_domain_name      = var.api_custom_domain_name
  certificate_arn         = data.terraform_remote_state.acm_apigw.outputs.certificate_arn
  validation_record_fqdns = local.validation_record_fqdns
  api_id                  = data.terraform_remote_state.core.outputs.api_id
  stage_name              = data.terraform_remote_state.core.outputs.api_stage_name
  tags                    = var.tags
}
