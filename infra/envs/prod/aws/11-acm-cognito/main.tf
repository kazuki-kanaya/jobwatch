module "acm" {
  source = "../../../../modules/aws/acm"

  domain_name = var.cognito_custom_domain_name
  tags        = var.tags
}
