#!/usr/bin/env bash
set -euo pipefail

JOBS_TABLE_NAME=${JOBS_TABLE_NAME:-jobwatch-jobs}
ENVIRONMENTS_TABLE_NAME=${ENVIRONMENTS_TABLE_NAME:-jobwatch-environments}
ENDPOINT=${DDB_ENDPOINT:-http://localhost:18000}
REGION=${AWS_REGION:-ap-northeast-1}

aws dynamodb create-table \
    --table-name "$JOBS_TABLE_NAME" \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT" \
    --region "$REGION"

aws dynamodb create-table \
    --table-name "$ENVIRONMENTS_TABLE_NAME" \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT" \
    --region "$REGION"
