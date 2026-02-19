#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CF_TF_DIR="$ROOT_DIR/infra/terraform/cloudflare"
DIST_DIR="$ROOT_DIR/web/dist"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required for infra/scripts/cloudflare/deploy-pages.sh" >&2
  exit 1
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "web build output not found: $DIST_DIR" >&2
  echo "Run: task web:build" >&2
  exit 1
fi

PROJECT_NAME="$(terraform -chdir="$CF_TF_DIR" output -raw pages_project_name 2>/dev/null || true)"

if [[ -z "$PROJECT_NAME" ]]; then
  echo "pages_project_name output was not found. Run: task infra:cf:apply" >&2
  exit 1
fi

pnpm dlx wrangler pages deploy "$DIST_DIR" --project-name "$PROJECT_NAME" --branch main
