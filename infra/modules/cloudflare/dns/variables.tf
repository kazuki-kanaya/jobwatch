variable "zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "records" {
  description = "DNS records to manage"
  type = map(object({
    name    = string
    type    = string
    content = string
    ttl     = optional(number, 1)
    proxied = optional(bool, false)
    comment = optional(string, null)
  }))
  default = {}
}
