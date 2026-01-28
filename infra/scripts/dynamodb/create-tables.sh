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
        AttributeName=job_id,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --global-secondary-indexes \
        "[{
            \"IndexName\": \"token_hash-index\",
            \"KeySchema\": [{\"AttributeName\":\"token_hash\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"}
        },{
            \"IndexName\": \"job_id-index\",
            \"KeySchema\": [{\"AttributeName\":\"job_id\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"}
        }]" \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT" \
    --region "$REGION"
