terraform {
  backend "s3" {
    key = "prod/aws/31-domain-cognito/terraform.tfstate"
  }
}
