terraform {
  backend "s3" {
    key = "prod/cloudflare/30-dns-records-api-auth/terraform.tfstate"
  }
}
