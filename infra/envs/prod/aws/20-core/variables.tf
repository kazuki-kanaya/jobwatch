variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "AWS profile"
  type        = string
  default     = "default"
}

variable "callback_urls" {
  description = "Cognito callback URLs"
  type        = list(string)
}

variable "logout_urls" {
  description = "Cognito logout URLs"
  type        = list(string)
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
}

variable "api_cors_allow_origins" {
  description = "Allowed origins for API Gateway CORS"
  type        = list(string)
}

variable "lambda_zip_path" {
  description = "Path to Lambda zip artifact"
  type        = string
  default     = "../../../../../api/build/lambda.zip"
}

variable "lambda_environment" {
  description = "Additional Lambda environment variables"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
