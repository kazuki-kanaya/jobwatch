#!/usr/bin/env bash
set -euo pipefail

TABLE_NAME=${OBSERN_DDB_TABLE_NAME:-obsern-dev}
ENDPOINT=${DDB_ENDPOINT:-http://localhost:4566}
REGION=${AWS_REGION:-ap-northeast-1}

aws_local() {
  AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-dummy} \
  AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-dummy} \
  aws --no-cli-pager "$@"
}

# Wait for LocalStack DynamoDB to become available (max 30 seconds)
for _ in {1..30}; do
  if aws_local dynamodb list-tables --endpoint-url "$ENDPOINT" --region "$REGION" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! aws_local dynamodb list-tables --endpoint-url "$ENDPOINT" --region "$REGION" >/dev/null 2>&1; then
  echo "LocalStack DynamoDB not ready at $ENDPOINT" >&2
  exit 1
fi

aws_local dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
        AttributeName=token_hash,AttributeType=S \
        AttributeName=job_id,AttributeType=S \
        AttributeName=membership_user_key,AttributeType=S \
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
        },{
            \"IndexName\": \"membership_user_key-index\",
            \"KeySchema\": [{\"AttributeName\":\"membership_user_key\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"}
        }]" \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT" \
    --region "$REGION" \
    >/dev/null 2>&1 || true

echo "Local DynamoDB table ensured: $TABLE_NAME"
