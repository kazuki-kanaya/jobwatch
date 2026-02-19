module "cognito" {
  source = "./modules/cognito"

  domain_prefix = var.cognito_domain_prefix
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls
  tags          = var.tags
}

module "dynamodb" {
  source = "./modules/dynamodb"

  table_name = var.dynamodb_table_name
  tags       = var.tags
}

module "lambda" {
  source = "./modules/lambda"

  lambda_zip_path    = var.lambda_zip_path
  dynamodb_table_arn = module.dynamodb.table_arn
  environment_variables = merge(
    var.lambda_environment,
    {
      JOBWATCH_DDB_TABLE_NAME = module.dynamodb.table_name
      JOBWATCH_OIDC_JWKS_URL  = module.cognito.oidc_jwks_url
      JOBWATCH_OIDC_AUDIENCE  = module.cognito.user_pool_client_id
      JOBWATCH_OIDC_ISSUER    = module.cognito.oidc_issuer
    },
  )
  tags = var.tags
}

module "apigateway" {
  source = "./modules/apigateway"

  lambda_function_name = module.lambda.function_name
  lambda_invoke_arn    = module.lambda.invoke_arn
  cors_allow_origins   = var.api_cors_allow_origins
  tags                 = var.tags
}
