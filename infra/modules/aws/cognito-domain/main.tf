terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

resource "aws_acm_certificate_validation" "this" {
  provider = aws.us_east_1

  certificate_arn         = var.certificate_arn
  validation_record_fqdns = var.validation_record_fqdns
}

resource "aws_cognito_user_pool_domain" "this" {
  domain = var.custom_domain_name

  user_pool_id          = var.user_pool_id
  certificate_arn       = aws_acm_certificate_validation.this.certificate_arn
  managed_login_version = 2
}

resource "aws_cognito_managed_login_branding" "this" {
  user_pool_id = var.user_pool_id
  client_id    = var.user_pool_client_id
  settings     = var.branding_settings_json
}
