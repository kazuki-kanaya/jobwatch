variable "domain_prefix" {
  description = "The prefix for the Cognito User Pool domain"
  type        = string
  default     = "jobwatch-app"
}

variable "callback_urls" {
  description = "List of callback URLs for the Cognito User Pool client"
  type        = list(string)
  default     = ["http://localhost:5173/auth/callback"]
}

variable "logout_urls" {
  description = "List of logout URLs for the Cognito User Pool client"
  type        = list(string)
  default     = ["http://localhost:5173/"]
}