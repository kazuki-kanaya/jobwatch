variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "The AWS CLI profile to use"
  type        = string
  default     = "default"
}

variable "cognito_domain_prefix" {
  description = "The prefix for the Cognito User Pool domain"
  type        = string
  default     = "jobwatch-app"
}

variable "callback_urls" {
  description = "List of callback URLs for the Cognito User Pool client"
  type        = list(string)
  default     = ["http://localhost:5173/auth/callback"]
}

variable "logout_urls" {
  description = "List of logout URLs for the Cognito User Pool client"
  type        = list(string)
  default     = ["http://localhost:5173/"]
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  type        = string
  default     = "jobwatch-table"
}

variable "api_cors_allow_origins" {
  description = "Allowed origins for API Gateway CORS"
  type        = list(string)
  default     = ["http://localhost:5173", "http://127.0.0.1:5173"]
}

variable "lambda_zip_path" {
  description = "Path to Lambda deployment zip artifact"
  type        = string
  default     = "../../../api/build/lambda.zip"
}

variable "lambda_environment" {
  description = "Environment variables passed to API Lambda"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Common tags for resources"
  type        = map(string)
  default     = {}
}
