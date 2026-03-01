terraform {
  backend "s3" {
    key = "prod/cloudflare/10-dns-validation/terraform.tfstate"
  }
}
