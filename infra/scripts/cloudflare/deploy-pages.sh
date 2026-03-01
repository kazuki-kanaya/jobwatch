#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CF_PAGES_TF_DIR="$ROOT_DIR/infra/envs/prod/cloudflare/20-pages"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required for infra/scripts/cloudflare/deploy-pages.sh" >&2
  exit 1
fi

deploy_one() {
  local target="$1"
  local dist_dir=""
  local work_dir=""
  local project_output=""

  case "$target" in
    site)
      dist_dir="$ROOT_DIR/site/dist"
      work_dir="$ROOT_DIR/site"
      project_output="site_pages_project_name"
      ;;
    dashboard)
      dist_dir="$ROOT_DIR/web/dist"
      work_dir="$ROOT_DIR/web"
      project_output="dashboard_pages_project_name"
      ;;
  esac

  if [[ ! -d "$dist_dir" ]]; then
    echo "$target build output not found: $dist_dir" >&2
    echo "Run: task ${target}:build" >&2
    exit 1
  fi

  local project_name
  project_name="$(terraform -chdir="$CF_PAGES_TF_DIR" output -raw "$project_output" 2>/dev/null || true)"

  if [[ -z "$project_name" ]]; then
    echo "$project_output output was not found. Run: task infra:apply:cloudflare" >&2
    exit 1
  fi

  (
    cd "$work_dir"
    pnpm dlx wrangler pages deploy dist --project-name "$project_name" --branch main
  )
}

deploy_one site
deploy_one dashboard
