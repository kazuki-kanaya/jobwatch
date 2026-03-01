output "api_id" {
  description = "HTTP API ID"
  value       = module.apigw.api_id
}

output "api_stage_name" {
  description = "HTTP API stage name"
  value       = module.apigw.stage_name
}

output "api_default_invoke_url" {
  description = "Default API Gateway invoke URL"
  value       = module.apigw.invoke_url
}

output "cognito_user_pool_client_id" {
  description = "Cognito app client ID"
  value       = module.cognito.user_pool_client_id
}

output "cognito_user_pool_id" {
  description = "Cognito user pool ID"
  value       = module.cognito.user_pool_id
}

output "oidc_issuer" {
  description = "OIDC issuer URL"
  value       = module.cognito.oidc_issuer
}

output "oidc_jwks_url" {
  description = "OIDC JWKS URL"
  value       = module.cognito.oidc_jwks_url
}
