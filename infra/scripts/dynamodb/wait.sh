#!/usr/bin/env bash
set -euo pipefail

ENDPOINT=${DDB_ENDPOINT:-http://localhost:18000}

# Wait for DynamoDB Local to become available (max 30 seconds)
for i in {1..30}; do
  if aws dynamodb list-tables --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    exit 0
  fi
  sleep 1
done

echo "DynamoDB Local not ready at $ENDPOINT" >&2
exit 1
