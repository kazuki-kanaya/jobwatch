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
  default     = ["http://localhost:5173/auth/callback"]
}

variable "logout_urls" {
  description = "Cognito logout URLs"
  type        = list(string)
  default     = ["http://localhost:5173/"]
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "obsern-table"
}

variable "api_cors_allow_origins" {
  description = "Allowed origins for API Gateway CORS"
  type        = list(string)
  default     = ["http://localhost:5173", "http://127.0.0.1:5173"]
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
