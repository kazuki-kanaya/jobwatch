output "certificate_arn" {
  description = "ACM certificate ARN for Cognito custom domain"
  value       = module.acm.certificate_arn
}

output "domain_validation_options" {
  description = "DNS validation options for Cognito ACM certificate"
  value       = module.acm.domain_validation_options
}
