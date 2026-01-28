#!/usr/bin/env bash
set -euo pipefail

JOBS_TABLE_NAME=${JOBS_TABLE_NAME:-jobwatch-jobs}
TABLE_NAME=${JOBWATCH_DDB_TABLE_NAME:-jobwatch-dev}
ENDPOINT=${DDB_ENDPOINT:-http://localhost:18000}
REGION=${AWS_REGION:-ap-northeast-1}

aws dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
        AttributeName=token_hash,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --global-secondary-indexes \
        "[{
            \"IndexName\": \"token_hash-index\",
            \"KeySchema\": [{\"AttributeName\":\"token_hash\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"},
            \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
        }]" \
    --billing-mode PROVISIONED \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url "$ENDPOINT" \
    --region "$REGION"
