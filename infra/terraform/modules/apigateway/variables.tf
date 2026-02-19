variable "lambda_function_name" {
  description = "Lambda function name allowed to be invoked by API Gateway"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda invoke ARN for API Gateway integration"
  type        = string
}

variable "tags" {
  description = "Tags for API Gateway resources"
  type        = map(string)
  default     = {}
}
