variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "site_project_name" {
  description = "Cloudflare Pages project name for landing/docs site"
  type        = string
  default     = "obsern-site"
}

variable "dashboard_project_name" {
  description = "Cloudflare Pages project name for dashboard app"
  type        = string
  default     = "obsern-dashboard"
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
