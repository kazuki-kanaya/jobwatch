resource "aws_acm_certificate_validation" "this" {
  certificate_arn = var.certificate_arn

  validation_record_fqdns = var.validation_record_fqdns
}

resource "aws_apigatewayv2_domain_name" "this" {
  domain_name = var.custom_domain_name

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.this.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = var.tags
}

resource "aws_apigatewayv2_api_mapping" "this" {
  api_id      = var.api_id
  domain_name = aws_apigatewayv2_domain_name.this.id
  stage       = var.stage_name
}
