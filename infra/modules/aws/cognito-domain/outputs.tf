output "cognito_hosted_ui_base_url" {
  description = "Cognito hosted UI base URL"
  value       = "https://${aws_cognito_user_pool_domain.this.domain}"
}

output "cognito_custom_domain_cloudfront_distribution" {
  description = "CloudFront distribution domain backing Cognito custom domain"
  value       = aws_cognito_user_pool_domain.this.cloudfront_distribution
}
