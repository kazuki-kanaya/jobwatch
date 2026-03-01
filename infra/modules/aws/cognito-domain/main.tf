terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

locals {
  use_custom_domain = var.cognito_custom_domain_name != null
}

resource "random_string" "domain_suffix" {
  count = local.use_custom_domain ? 0 : 1

  length  = 6
  special = false
  upper   = false
}

resource "aws_acm_certificate_validation" "this" {
  count    = local.use_custom_domain ? 1 : 0
  provider = aws.us_east_1

  certificate_arn         = var.certificate_arn
  validation_record_fqdns = var.validation_record_fqdns
}

resource "aws_cognito_user_pool_domain" "this" {
  domain = local.use_custom_domain ? var.cognito_custom_domain_name : "${var.cognito_domain_prefix}-${random_string.domain_suffix[0].result}"

  user_pool_id          = var.user_pool_id
  certificate_arn       = local.use_custom_domain ? aws_acm_certificate_validation.this[0].certificate_arn : null
  managed_login_version = 2

  lifecycle {
    precondition {
      condition     = local.use_custom_domain == (var.certificate_arn != null)
      error_message = "Set certificate_arn only when cognito_custom_domain_name is set."
    }
  }
}

resource "aws_cognito_managed_login_branding" "this" {
  user_pool_id = var.user_pool_id
  client_id    = var.user_pool_client_id
  settings     = var.branding_settings_json
}
