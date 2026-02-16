output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.cognito.user_pool_client_id
}

output "oidc_issuer" {
  description = "OIDC issuer URL"
  value       = module.cognito.oidc_issuer
}

output "oidc_jwks_url" {
  description = "OIDC JWKS URL"
  value       = module.cognito.oidc_jwks_url
}

output "cognito_hosted_ui_base_url" {
  description = "Cognito hosted UI base URL"
  value       = module.cognito.hosted_ui_base_url
}
