data "terraform_remote_state" "acm_cognito" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "prod/aws/11-acm-cognito/terraform.tfstate"
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
    for dvo in data.terraform_remote_state.acm_cognito.outputs.domain_validation_options : dvo.resource_record_name
  ]
}

module "cognito_domain" {
  source = "../../../../modules/aws/cognito-domain"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  user_pool_id            = data.terraform_remote_state.core.outputs.cognito_user_pool_id
  user_pool_client_id     = data.terraform_remote_state.core.outputs.cognito_user_pool_client_id
  custom_domain_name      = var.custom_domain_name
  certificate_arn         = data.terraform_remote_state.acm_cognito.outputs.certificate_arn
  validation_record_fqdns = local.validation_record_fqdns
  branding_settings_json  = file("${path.module}/../../../../modules/aws/cognito/assets/cognito-managed-login-branding.json")
}
