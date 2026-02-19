locals {
  api_name = "jobwatch-api"
}

resource "aws_apigatewayv2_api" "this" {
  name          = local.api_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    allow_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_headers = ["authorization", "content-type"]
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "access" {
  name              = "/aws/apigateway/${local.api_name}"
  retention_in_days = 7
  tags              = var.tags
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "root" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "proxy" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.access.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      path           = "$context.path"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      ip             = "$context.identity.sourceIp"
      userAgent      = "$context.identity.userAgent"
      integrationErr = "$context.integrationErrorMessage"
    })
  }

  tags = var.tags
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}
