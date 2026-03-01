terraform {
  backend "s3" {
    key = "prod/aws/30-domain-apigw/terraform.tfstate"
  }
}
