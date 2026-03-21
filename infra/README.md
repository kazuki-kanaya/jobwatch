# Infra

This directory manages Terraform infrastructure as staged stacks under `envs/prod`.  
Tasks are split between `envs/prod` and `envs/local`, and composed through `infra/Taskfile.yaml`.

## Layout

- `envs/prod/aws/00-bootstrap`: Terraform backend bootstrap (S3 state bucket)
- `envs/prod/aws/10-acm-apigw`: ACM certificate for API domain
- `envs/prod/aws/11-acm-cognito`: ACM certificate for Cognito custom domain
- `envs/prod/aws/20-core`: Cognito / DynamoDB / Lambda / API Gateway core
- `envs/prod/aws/30-domain-apigw`: API Gateway custom domain and mapping
- `envs/prod/aws/31-domain-cognito`: Cognito custom domain
- `envs/prod/cloudflare/00-zone-foundation`: Cloudflare zone-wide baseline settings (Bot Fight Mode / HTTPS / DNSSEC / Security Level)
- `envs/prod/cloudflare/10-dns-validation`: DNS records for ACM validation
- `envs/prod/cloudflare/20-pages`: Cloudflare Pages projects
- `envs/prod/cloudflare/21-pages-domain-dns-records`: Pages custom domains and DNS records (`obsern.dev`, `app.obsern.dev`)
- `envs/prod/cloudflare/30-dns-records-api-auth`: DNS records for `api` / `auth`
- `envs/prod/Taskfile.yaml`: Tasks for production infrastructure
- `envs/local/Taskfile.yaml`: Tasks for local development
- `modules/`: Shared Terraform modules
- `scripts/`: Helper scripts

## First-Time Setup

1. Create and edit `terraform.tfvars`:
   - `task infra:init:tfvars`
2. Create backend resources (one time):
   - `task infra:init:bootstrap`
   - `task infra:apply:bootstrap`
3. Create and edit the backend config:
   - `cp infra/envs/prod/backend.s3.hcl.example infra/envs/prod/backend.s3.hcl`
4. Initialize each stage:
   - `task infra:init`
5. Apply the Cloudflare zone foundation when needed:
   - `task infra:plan:foundation`
   - `task infra:apply:foundation`

## Required Credentials and Keys

### AWS

- AWS credentials (`~/.aws/credentials` / `~/.aws/config`)
- `aws_profile` (in each `terraform.tfvars`, default: `default`)
- Backend settings in `infra/envs/prod/backend.s3.hcl`:
  - `bucket`
  - `region`
  - `profile`
  - `use_lockfile`

### Cloudflare

- `cloudflare_account_id` (for Pages)
- `cloudflare_zone_id` (for DNS)
- A custom domain you control (required, e.g. `example.dev`)
- API tokens by purpose:
  - Pages token (for Pages operations in `20-pages` and `21-pages-domain-dns-records`)
  - Zone token (for `00-zone-foundation`, DNS operations in `10-dns-validation` and `21-pages-domain-dns-records`, and `30-dns-records-api-auth`)

Recommended permissions:

- Pages token: `Account / Cloudflare Pages / Edit`
- Zone token: `Zone / DNS / Edit` + `Zone / Zone / Read`

Set tokens in `terraform.tfvars`, and do not commit them to the repository.

## Main Commands

- Plan: `task infra:plan`
- Apply (in dependency order): `task infra:apply`
- Deploy Pages artifacts: `task infra:deploy:pages`
- Apply + deploy: `task infra:deploy`
- Destroy (in reverse order): `task infra:destroy`

At the end of `task infra:apply`, `task infra:sync-dot-env` runs and updates the web/api env files from Terraform outputs.

`00-zone-foundation` is not part of the regular `apply` / `destroy` flow.  
It manages zone-wide posture and should be applied only when those baseline settings need to change.

## Apply Order

1. `aws/10-acm-apigw`
2. `aws/11-acm-cognito`
3. `cloudflare/10-dns-validation`
4. `aws/20-core`
5. `aws/30-domain-apigw`
6. `cloudflare/20-pages`
7. `cloudflare/21-pages-domain-dns-records`
8. `aws/31-domain-cognito`
9. `cloudflare/30-dns-records-api-auth`

### Why This Order

- `aws/10` and `aws/11` create ACM certificates for API/Cognito first.
- `cloudflare/10` creates DNS validation records for those certificates immediately after certificate creation.
- `aws/20` provisions the core application resources (Cognito/Lambda/API Gateway) that later domain-related stages depend on.
- `aws/30` creates the API custom domain on top of the API Gateway resources from `aws/20`.
- `cloudflare/20` creates Pages projects.
- `cloudflare/21` configures Pages custom domains and parent-domain DNS. This helps the later Cognito custom domain validation succeed.
- `aws/31` requires parent domain resolution when creating `auth.<domain>`, so it runs after `cloudflare/21`.
- `cloudflare/30` publishes the final `api/auth` DNS records using outputs from `aws/30` and `aws/31`.

`cloudflare/00-zone-foundation` is intentionally excluded from this sequence.  
It has no stack dependencies and is operated separately from the normal application provisioning flow.

## Notes

- Cross-stage dependencies are handled via `terraform_remote_state`.
- Avoid parallel execution unless all dependencies are already satisfied.
- Pages uploads are handled after `task infra:apply` by `scripts/cloudflare/deploy-pages.sh`.

## Local Development (Non-Terraform)

Local development does not use Terraform.  
Use `docker compose` and Task commands to start the environment. Authentication is provided by Keycloak, and LocalStack (DynamoDB) is used for storage.

- Start (with initialization): `task infra:local:up`
- Stop (including volume cleanup): `task infra:local:down`

`task infra:local:up` runs the following steps in order:

1. `docker compose down -v`
2. `docker compose up -d`
3. Create the DynamoDB table via `infra/scripts/local/up-localstack-ddb.sh`
4. Sync local settings to `web/.env.local` and `api/.env`

### Notes

- Email sending and receiving are not used in local development.
- Reset passwords from the Keycloak admin console: `http://localhost:8080/admin/`
- Admin credentials are `admin` / `admin`.
