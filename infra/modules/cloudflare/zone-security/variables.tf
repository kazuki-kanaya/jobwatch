variable "always_use_https" {
  description = "Whether to redirect all HTTP requests to HTTPS"
  type        = bool
  default     = true
}

variable "automatic_https_rewrites" {
  description = "Whether to rewrite mixed-content HTTP URLs to HTTPS when possible"
  type        = bool
  default     = true
}

variable "bot_fight_mode" {
  description = "Whether to enable Bot Fight Mode"
  type        = bool
  default     = true
}

variable "dnssec_enabled" {
  description = "Whether to enable DNSSEC for the zone"
  type        = bool
  default     = true
}

variable "security_level" {
  description = "Cloudflare security level for IP reputation based challenges"
  type        = string
  default     = "medium"

  validation {
    condition     = contains(["off", "essentially_off", "low", "medium", "high", "under_attack"], var.security_level)
    error_message = "security_level must be one of off, essentially_off, low, medium, high, or under_attack."
  }
}

variable "zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}
