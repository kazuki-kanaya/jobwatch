variable "user_pool_id" {
  description = "Cognito user pool ID"
  type        = string
}

variable "user_pool_client_id" {
  description = "Cognito user pool client ID"
  type        = string
}

variable "custom_domain_name" {
  description = "Custom domain for Cognito hosted UI"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN in us-east-1 for custom domain"
  type        = string
}

variable "validation_record_fqdns" {
  description = "FQDNs of ACM DNS validation records"
  type        = list(string)
}

variable "branding_settings_json" {
  description = "JSON string for Cognito managed login branding settings"
  type        = string
}
