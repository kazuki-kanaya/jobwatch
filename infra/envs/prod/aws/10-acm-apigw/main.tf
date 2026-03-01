module "acm" {
  source = "../../../../modules/aws/acm"

  domain_name = var.api_custom_domain_name
  tags        = var.tags
}
