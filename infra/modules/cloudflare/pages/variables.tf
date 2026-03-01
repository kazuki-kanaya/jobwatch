variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Pages project name"
  type        = string
}

variable "env_vars" {
  description = "Environment variables for the Pages project"
  type = map(object({
    type    = string
    value   = string
  }))
  default     = null
}
