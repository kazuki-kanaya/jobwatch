terraform {
  backend "s3" {
    key = "prod/aws/11-acm-cognito/terraform.tfstate"
  }
}
