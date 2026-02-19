# Terraform Layout

- `aws/`: AWS infrastructure (Cognito, DynamoDB, Lambda, API Gateway)
- `cloudflare/`: Cloudflare infrastructure (Pages)

Each directory owns its own Terraform state and lifecycle.

## Common Commands

- AWS: `task infra:aws:plan`, `task infra:aws:apply`
- Cloudflare: `task infra:cf:plan`, `task infra:cf:apply`

## Pages Deploy (Direct Upload)

- First login: `pnpm dlx wrangler login`
- Deploy web: `task infra:deploy:web`

## `/cli/*` Proxy on Pages

- `web/functions/cli/[[path]].ts` proxies `/cli/*` requests to `API_ORIGIN`.
- `api_origin` is generated from AWS outputs into `infra/terraform/cloudflare/from_aws.auto.tfvars`.
- Run `task infra:cf:sync-from-aws` (also executed by `task infra:cf:plan` and `task infra:cf:apply`).
