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

variable "cognito_custom_domain_name" {
  description = "Custom domain for Cognito hosted UI"
  type        = string
  default     = null
}

variable "cognito_domain_prefix" {
  description = "Prefix for Cognito hosted UI domain when using default domain"
  type        = string
  default     = "obsern-app"
}

variable "terraform_state_bucket" {
  description = "S3 bucket name storing staged Terraform states"
  type        = string
}

variable "terraform_state_region" {
  description = "AWS region for Terraform state bucket"
  type        = string
  default     = "ap-northeast-1"
}

variable "terraform_state_profile" {
  description = "AWS profile for reading Terraform remote states"
  type        = string
  default     = "default"
}
