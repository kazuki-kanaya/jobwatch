variable "aws_profile" {
  description = "AWS profile"
  type        = string
  default     = "default"
}

variable "cognito_custom_domain_name" {
  description = "Cognito custom domain name"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
