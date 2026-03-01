locals {
  use_custom_domain = var.cognito_custom_domain_name != null
}

data "terraform_remote_state" "acm_cognito" {
  count   = local.use_custom_domain ? 1 : 0
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
  validation_record_fqdns = local.use_custom_domain ? [
    for dvo in data.terraform_remote_state.acm_cognito[0].outputs.domain_validation_options : dvo.resource_record_name
  ] : []
}

module "cognito_domain" {
  source = "../../../../modules/aws/cognito-domain"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  user_pool_id               = data.terraform_remote_state.core.outputs.cognito_user_pool_id
  user_pool_client_id        = data.terraform_remote_state.core.outputs.cognito_user_pool_client_id
  cognito_custom_domain_name = var.cognito_custom_domain_name
  cognito_domain_prefix      = var.cognito_domain_prefix
  certificate_arn            = local.use_custom_domain ? data.terraform_remote_state.acm_cognito[0].outputs.certificate_arn : null
  validation_record_fqdns    = local.validation_record_fqdns
  branding_settings_json     = file("${path.module}/../../../../modules/aws/cognito/assets/cognito-managed-login-branding.json")
  aws_region                 = var.aws_region
}
