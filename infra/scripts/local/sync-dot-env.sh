#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
WEB_ENV_FILE="$ROOT_DIR/web/.env.local"
API_ENV_FILE="$ROOT_DIR/api/.env"

OIDC_ISSUER="http://localhost:8080/realms/obsern-local"
OIDC_CLIENT_ID="obsern-web-local"
OIDC_AUTH_DOMAIN="http://localhost:8080/realms/obsern-local/protocol/openid-connect"
OIDC_JWKS_URL="http://localhost:8080/realms/obsern-local/protocol/openid-connect/certs"
API_BASE_URL="http://127.0.0.1:8000"

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

remove_env() {
  local file="$1"
  local key="$2"
  local tmp
  tmp="$(mktemp)"

  if [[ ! -f "$file" ]]; then
    return
  fi

  awk -v k="$key" '$0 !~ "^" k "=" { print }' "$file" > "$tmp"
  mv "$tmp" "$file"
}

upsert_env "$WEB_ENV_FILE" "VITE_OIDC_ISSUER" "$OIDC_ISSUER"
upsert_env "$WEB_ENV_FILE" "VITE_OIDC_CLIENT_ID" "$OIDC_CLIENT_ID"
upsert_env "$WEB_ENV_FILE" "VITE_OIDC_AUTH_DOMAIN" "$OIDC_AUTH_DOMAIN"
upsert_env "$WEB_ENV_FILE" "VITE_API_BASE_URL" "$API_BASE_URL"
remove_env "$WEB_ENV_FILE" "VITE_OIDC_AUTHORITY"
remove_env "$WEB_ENV_FILE" "VITE_OIDC_COGNITO_DOMAIN"

upsert_env "$API_ENV_FILE" "OBSERN_OIDC_JWKS_URL" "$OIDC_JWKS_URL"
upsert_env "$API_ENV_FILE" "OBSERN_OIDC_AUDIENCE" "$OIDC_CLIENT_ID"
upsert_env "$API_ENV_FILE" "OBSERN_OIDC_ISSUER" "$OIDC_ISSUER"

echo "Synced local env files:"
echo "- $WEB_ENV_FILE"
echo "- $API_ENV_FILE"
