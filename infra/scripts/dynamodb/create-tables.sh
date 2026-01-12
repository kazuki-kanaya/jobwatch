#!/usr/bin/env bash
set -euo pipefail

JOBS_TABLE_NAME=${JOBS_TABLE_NAME:-jobwatch-jobs}
ENDPOINT=${DDB_ENDPOINT:-http://localhost:18000}
REGION=${AWS_REGION:-ap-northeast-1}

aws dynamodb create-table \
    --table-name "$JOBS_TABLE_NAME" \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT" \
    --region "$REGION"
