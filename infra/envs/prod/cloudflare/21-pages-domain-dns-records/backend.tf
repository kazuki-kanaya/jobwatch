terraform {
  backend "s3" {
    key = "prod/cloudflare/21-pages-domain-dns-records/terraform.tfstate"
  }
}
