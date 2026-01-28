from typing import Any, Iterable

from botocore.exceptions import ClientError

from app.domain.exceptions import NotFoundException, RepositoryException


class DynamoDBTable:
    def __init__(self, table: Any):
        self._table = table

    def put(self, item: dict) -> None:
        try:
            self._table.put_item(Item=item)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            raise RepositoryException(
                f"Failed to put item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def get(self, pk: str, sk: str) -> dict | None:
        try:
            response = self._table.get_item(Key={"PK": pk, "SK": sk})
            return response.get("Item")
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Table not found") from e
            raise RepositoryException(
                f"Failed to get item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def delete(self, pk: str, sk: str) -> None:
        try:
            self._table.delete_item(Key={"PK": pk, "SK": sk})
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            raise RepositoryException(
                f"Failed to delete item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def batch_delete(self, items: list[dict]) -> None:
        """Delete multiple items in batch. Items must have PK and SK keys."""
        if not items:
            return

        try:
            with self._table.batch_writer() as batch:
                for item in items:
                    batch.delete_item(Key={"PK": item["PK"], "SK": item["SK"]})
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            raise RepositoryException(
                f"Failed to batch delete items: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def query_begins_with(self, pk: str, sk_prefix: str) -> Iterable[dict]:
        try:
            last_evaluated_key = None
            while True:
                query_kwargs = {
                    "KeyConditionExpression": "PK = :pk AND begins_with(SK, :pfx)",
                    "ExpressionAttributeValues": {":pk": pk, ":pfx": sk_prefix},
                }
                if last_evaluated_key:
                    query_kwargs["ExclusiveStartKey"] = last_evaluated_key

                response = self._table.query(**query_kwargs)
                yield from response.get("Items", [])

                last_evaluated_key = response.get("LastEvaluatedKey")
                if not last_evaluated_key:
                    break
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Table not found") from e
            raise RepositoryException(
                f"Failed to query items: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def query_all(self, pk: str) -> Iterable[dict]:
        try:
            last_evaluated_key = None
            while True:
                query_kwargs = {
                    "KeyConditionExpression": "PK = :pk",
                    "ExpressionAttributeValues": {":pk": pk},
                }
                if last_evaluated_key:
                    query_kwargs["ExclusiveStartKey"] = last_evaluated_key

                response = self._table.query(**query_kwargs)
                yield from response.get("Items", [])

                last_evaluated_key = response.get("LastEvaluatedKey")
                if not last_evaluated_key:
                    break
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Table not found") from e
            raise RepositoryException(
                f"Failed to query items: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def query_gsi(
        self, index_name: str, key_name: str, key_value: str
    ) -> Iterable[dict]:
        """Query a Global Secondary Index by a single key."""
        try:
            last_evaluated_key = None
            while True:
                query_kwargs = {
                    "IndexName": index_name,
                    "KeyConditionExpression": f"{key_name} = :val",
                    "ExpressionAttributeValues": {":val": key_value},
                }
                if last_evaluated_key:
                    query_kwargs["ExclusiveStartKey"] = last_evaluated_key

                response = self._table.query(**query_kwargs)
                yield from response.get("Items", [])

                last_evaluated_key = response.get("LastEvaluatedKey")
                if not last_evaluated_key:
                    break
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Index not found") from e
            raise RepositoryException(
                f"Failed to query GSI: {error_code} - {e.response['Error']['Message']}"
            ) from e
