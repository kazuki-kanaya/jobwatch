output "api_origin" {
  description = "Canonical API origin"
  value       = module.apigw_custom_domain.api_origin
}

output "apigw_domain_target" {
  description = "API Gateway domain target for DNS CNAME"
  value       = module.apigw_custom_domain.target_domain_name
}

output "apigw_domain_hosted_zone_id" {
  description = "Hosted zone ID for API Gateway domain target"
  value       = module.apigw_custom_domain.hosted_zone_id
}
