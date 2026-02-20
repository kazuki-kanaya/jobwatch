variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name"
  type        = string
  default     = "jobwatch-web"
}

variable "api_origin" {
  description = "Backend API origin for /cli proxy (for example, API Gateway invoke URL)"
  type        = string
}
