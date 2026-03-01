variable "user_pool_id" {
  description = "Cognito user pool ID"
  type        = string
}

variable "user_pool_client_id" {
  description = "Cognito user pool client ID"
  type        = string
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

variable "certificate_arn" {
  description = "ACM certificate ARN in us-east-1 for custom domain"
  type        = string
  default     = null
}

variable "validation_record_fqdns" {
  description = "FQDNs of ACM DNS validation records"
  type        = list(string)
  default     = []
}

variable "branding_settings_json" {
  description = "JSON string for Cognito managed login branding settings"
  type        = string
}

variable "aws_region" {
  description = "AWS region where the Cognito user pool exists"
  type        = string
}
