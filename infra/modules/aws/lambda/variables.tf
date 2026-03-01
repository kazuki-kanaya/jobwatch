variable "lambda_zip_path" {
  description = "Path to prebuilt Lambda deployment artifact (.zip)"
  type        = string
}

variable "environment_variables" {
  description = "Lambda environment variables"
  type        = map(string)
  default     = {}
}

variable "dynamodb_table_arn" {
  description = "DynamoDB table ARN to allow Lambda access"
  type        = string
}

variable "tags" {
  description = "Tags for Lambda and IAM resources"
  type        = map(string)
  default     = {}
}
