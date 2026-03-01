output "target_domain_name" {
  description = "Target domain name for DNS CNAME"
  value       = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].target_domain_name
}

output "hosted_zone_id" {
  description = "Hosted zone ID of target domain"
  value       = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].hosted_zone_id
}

output "api_origin" {
  description = "Canonical API origin URL"
  value       = "https://${var.custom_domain_name}"
}
