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
