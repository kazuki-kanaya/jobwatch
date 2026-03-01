variable "callback_urls" {
  description = "List of callback URLs for the Cognito User Pool client"
  type        = list(string)
}

variable "logout_urls" {
  description = "List of logout URLs for the Cognito User Pool client"
  type        = list(string)
}

variable "tags" {
  description = "Tags for the Cognito User Pool"
  type        = map(string)
  default     = {}
}
