variable "custom_domain_name" {
  description = "Custom domain name for API Gateway"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for custom domain"
  type        = string
}

variable "validation_record_fqdns" {
  description = "FQDNs of DNS validation records"
  type        = list(string)
  default     = []
}

variable "api_id" {
  description = "HTTP API ID"
  type        = string
}

variable "stage_name" {
  description = "API stage name"
  type        = string
}

variable "tags" {
  description = "Tags for API Gateway custom domain resources"
  type        = map(string)
  default     = {}
}
