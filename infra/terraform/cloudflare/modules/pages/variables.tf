variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Pages project name"
  type        = string
}

variable "api_origin" {
  description = "Backend API origin for /cli proxy"
  type        = string
}
