output "api_id" {
  description = "HTTP API ID"
  value       = aws_apigatewayv2_api.this.id
}

output "stage_name" {
  description = "API stage name"
  value       = aws_apigatewayv2_stage.this.name
}

output "invoke_url" {
  description = "API Gateway stage invoke URL"
  value       = aws_apigatewayv2_stage.this.invoke_url
}
