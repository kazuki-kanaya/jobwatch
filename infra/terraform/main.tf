module "cognito" {
  source = "./modules/cognito"

  domain_prefix = var.cognito_domain_prefix
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls
  tags          = var.tags
}

module "dynamodb" {
  count  = var.enable_serverless_api ? 1 : 0
  source = "./modules/dynamodb"

  table_name = var.dynamodb_table_name
  tags       = var.tags
}

module "lambda" {
  count  = var.enable_serverless_api ? 1 : 0
  source = "./modules/lambda"

  lambda_zip_path    = var.lambda_zip_path
  dynamodb_table_arn = module.dynamodb[0].table_arn
  environment_variables = merge(
    var.lambda_environment,
    {
      JOBWATCH_DDB_TABLE_NAME = module.dynamodb[0].table_name
      JOBWATCH_OIDC_JWKS_URL  = module.cognito.oidc_jwks_url
      JOBWATCH_OIDC_AUDIENCE  = module.cognito.user_pool_client_id
      JOBWATCH_OIDC_ISSUER    = module.cognito.oidc_issuer
    },
  )
  tags = var.tags
}

module "apigateway" {
  count  = var.enable_serverless_api ? 1 : 0
  source = "./modules/apigateway"

  lambda_function_name = module.lambda[0].function_name
  lambda_invoke_arn    = module.lambda[0].invoke_arn
  tags                 = var.tags
}
