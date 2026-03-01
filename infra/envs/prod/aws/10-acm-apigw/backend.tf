terraform {
  backend "s3" {
    key = "prod/aws/10-acm-apigw/terraform.tfstate"
  }
}
