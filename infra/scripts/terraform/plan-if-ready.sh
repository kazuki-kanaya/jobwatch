#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <target_dir> <skip_message> <dep_dir:output_name>..." >&2
  exit 2
fi

target_dir="$1"
shift
skip_message="$1"
shift

has_output() {
  local dep="$1"
  local dep_dir="${dep%%:*}"
  local output_name="${dep#*:}"

  terraform -chdir="$dep_dir" output -json "$output_name" >/dev/null 2>&1
}

for dep in "$@"; do
  if ! has_output "$dep"; then
    echo "$skip_message"
    exit 0
  fi
done

terraform -chdir="$target_dir" plan -input=false
