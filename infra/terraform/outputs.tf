output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.cognito.user_pool_client_id
}

output "cognito_user_pool_domain" {
  description = "Cognito User Pool Domain (full URL)"
  value       = module.cognito.user_pool_domain
}

output "cognito_domain_prefix" {
  description = "Cognito Domain Prefix"
  value       = module.cognito.domain_prefix
}