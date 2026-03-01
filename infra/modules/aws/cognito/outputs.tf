output "user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.this.id
}

output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.this.id
}

output "oidc_issuer" {
  description = "OIDC issuer URL for Cognito user pool"
  value       = "https://cognito-idp.${data.aws_region.current.id}.amazonaws.com/${aws_cognito_user_pool.this.id}"
}

output "oidc_jwks_url" {
  description = "OIDC JWKS URL for Cognito user pool"
  value       = "https://cognito-idp.${data.aws_region.current.id}.amazonaws.com/${aws_cognito_user_pool.this.id}/.well-known/jwks.json"
}
