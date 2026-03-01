output "cognito_hosted_ui_base_url" {
  description = "Cognito hosted UI base URL"
  value       = var.cognito_custom_domain_name != null ? "https://${aws_cognito_user_pool_domain.this.domain}" : "https://${aws_cognito_user_pool_domain.this.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "cognito_custom_domain_cloudfront_distribution" {
  description = "CloudFront distribution domain backing Cognito custom domain"
  value       = var.cognito_custom_domain_name != null ? aws_cognito_user_pool_domain.this.cloudfront_distribution : null
}
