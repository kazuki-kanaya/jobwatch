output "certificate_arn" {
  description = "ACM certificate ARN for API domain"
  value       = module.acm.certificate_arn
}

output "domain_validation_options" {
  description = "DNS validation options for ACM"
  value       = module.acm.domain_validation_options
}
