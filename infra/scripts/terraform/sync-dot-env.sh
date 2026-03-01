#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
AWS_CORE_TF_DIR="$ROOT_DIR/infra/envs/prod/aws/20-core"
AWS_APIGW_DOMAIN_TF_DIR="$ROOT_DIR/infra/envs/prod/aws/30-domain-apigw"
AWS_COGNITO_DOMAIN_TF_DIR="$ROOT_DIR/infra/envs/prod/aws/31-domain-cognito"
WEB_ENV_FILE="$ROOT_DIR/web/.env.local"
API_ENV_FILE="$ROOT_DIR/api/.env"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for infra/scripts/terraform/sync-dot-env.sh" >&2
  exit 1
fi

core_outputs_json="$(terraform -chdir="$AWS_CORE_TF_DIR" output -json)"

oidc_issuer="$(echo "$core_outputs_json" | jq -r '.oidc_issuer.value')"
oidc_jwks_url="$(echo "$core_outputs_json" | jq -r '.oidc_jwks_url.value')"
oidc_client_id="$(echo "$core_outputs_json" | jq -r '.cognito_user_pool_client_id.value')"
api_default_invoke_url="$(echo "$core_outputs_json" | jq -r '.api_default_invoke_url.value // empty')"

api_origin="$(terraform -chdir="$AWS_APIGW_DOMAIN_TF_DIR" output -raw api_origin 2>/dev/null || true)"
oidc_auth_domain="$(terraform -chdir="$AWS_COGNITO_DOMAIN_TF_DIR" output -raw cognito_hosted_ui_base_url 2>/dev/null || true)"

if [[ -z "$oidc_auth_domain" ]]; then
  oidc_auth_domain="http://localhost:5173"
fi
if [[ -n "$api_origin" ]]; then
  api_base_url="$api_origin"
elif [[ -n "$api_default_invoke_url" ]]; then
  api_base_url="$api_default_invoke_url"
else
  api_base_url="http://127.0.0.1:8000"
fi

upsert_env() {
  local file="$1"
  local key="$2"
  local value="$3"
  local tmp
  tmp="$(mktemp)"

  if [[ ! -f "$file" ]]; then
    touch "$file"
  fi

  awk -v k="$key" -v v="$value" '
    BEGIN { done=0 }
    $0 ~ "^" k "=" {
      print k "=\"" v "\""
      done=1
      next
    }
    { print }
    END {
      if (!done) print k "=\"" v "\""
    }
  ' "$file" > "$tmp"

  mv "$tmp" "$file"
}

upsert_env "$WEB_ENV_FILE" "VITE_OIDC_ISSUER" "$oidc_issuer"
upsert_env "$WEB_ENV_FILE" "VITE_OIDC_CLIENT_ID" "$oidc_client_id"
upsert_env "$WEB_ENV_FILE" "VITE_OIDC_AUTH_DOMAIN" "$oidc_auth_domain"
upsert_env "$WEB_ENV_FILE" "VITE_API_BASE_URL" "$api_base_url"

upsert_env "$API_ENV_FILE" "OBSERN_OIDC_JWKS_URL" "$oidc_jwks_url"
upsert_env "$API_ENV_FILE" "OBSERN_OIDC_AUDIENCE" "$oidc_client_id"
upsert_env "$API_ENV_FILE" "OBSERN_OIDC_ISSUER" "$oidc_issuer"

echo "Synced env files:"
echo "- $WEB_ENV_FILE"
echo "- $API_ENV_FILE"
