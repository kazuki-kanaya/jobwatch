output "cognito_hosted_ui_base_url" {
  description = "Cognito hosted UI base URL"
  value       = module.cognito_domain.cognito_hosted_ui_base_url
}

output "cognito_custom_domain_cloudfront_distribution" {
  description = "CloudFront distribution domain backing Cognito custom domain"
  value       = module.cognito_domain.cognito_custom_domain_cloudfront_distribution
}
