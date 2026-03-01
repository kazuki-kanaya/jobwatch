variable "domain_name" {
  description = "Primary domain for ACM certificate"
  type        = string
}

variable "tags" {
  description = "Tags for ACM resources"
  type        = map(string)
  default     = {}
}
