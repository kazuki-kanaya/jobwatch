terraform {
  backend "s3" {
    key = "prod/aws/20-core/terraform.tfstate"
  }
}
