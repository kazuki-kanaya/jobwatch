#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TF_DIR="$ROOT_DIR/infra/terraform/aws"
WEB_ENV_FILE="$ROOT_DIR/web/.env.local"
API_ENV_FILE="$ROOT_DIR/api/.env"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for infra/scripts/aws/sync-dot-env.sh" >&2
  exit 1
fi

outputs_json="$(terraform -chdir="$TF_DIR" output -json)"

oidc_issuer="$(echo "$outputs_json" | jq -r '.oidc_issuer.value')"
oidc_jwks_url="$(echo "$outputs_json" | jq -r '.oidc_jwks_url.value')"
oidc_client_id="$(echo "$outputs_json" | jq -r '.cognito_user_pool_client_id.value')"
oidc_cognito_domain="$(echo "$outputs_json" | jq -r '.cognito_hosted_ui_base_url.value')"
api_invoke_url="$(echo "$outputs_json" | jq -r '.api_invoke_url.value // empty')"
api_base_url="${api_invoke_url:-http://127.0.0.1:8000}"

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

upsert_env "$WEB_ENV_FILE" "VITE_OIDC_AUTHORITY" "$oidc_issuer"
upsert_env "$WEB_ENV_FILE" "VITE_OIDC_CLIENT_ID" "$oidc_client_id"
upsert_env "$WEB_ENV_FILE" "VITE_OIDC_COGNITO_DOMAIN" "$oidc_cognito_domain"
upsert_env "$WEB_ENV_FILE" "VITE_API_BASE_URL" "$api_base_url"

upsert_env "$API_ENV_FILE" "JOBWATCH_OIDC_JWKS_URL" "$oidc_jwks_url"
upsert_env "$API_ENV_FILE" "JOBWATCH_OIDC_AUDIENCE" "$oidc_client_id"
upsert_env "$API_ENV_FILE" "JOBWATCH_OIDC_ISSUER" "$oidc_issuer"

echo "Synced env files:"
echo "- $WEB_ENV_FILE"
echo "- $API_ENV_FILE"
