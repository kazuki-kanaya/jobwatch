variable "cloudflare_dns_api_token" {
  description = "Cloudflare API token for DNS record operations"
  type        = string
  sensitive   = true
}

variable "cloudflare_pages_api_token" {
  description = "Cloudflare API token for Pages domain operations"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "dashboard_domain_name" {
  description = "Dashboard custom domain for Pages"
  type        = string
  default     = "app.obsern.dev"
}

variable "pages_domain_record_proxied" {
  description = "Whether Pages domain CNAME records are proxied by Cloudflare"
  type        = bool
  default     = true
}

variable "site_domain_name" {
  description = "Site custom domain for Pages"
  type        = string
  default     = "obsern.dev"
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
