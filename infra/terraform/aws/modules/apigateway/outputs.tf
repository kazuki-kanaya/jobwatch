output "invoke_url" {
  description = "API Gateway stage invoke URL"
  value       = aws_apigatewayv2_stage.this.invoke_url
}
