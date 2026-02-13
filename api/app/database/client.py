import logging
from typing import Any, Iterable, Type, TypeVar

from botocore.exceptions import ClientError
from pydantic import BaseModel

from app.models.exceptions import (
    ConditionalCheckFailedError,
    NotFoundException,
    RepositoryException,
)

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class DynamoDBKeys:
    """DynamoDB key generation utilities."""

    @staticmethod
    def workspace_pk(workspace_id: str) -> str:
        return f"WORKSPACE#{workspace_id}"

    @staticmethod
    def workspace_sk() -> str:
        return "META#WORKSPACE"

    @staticmethod
    def host_sk(host_id: str) -> str:
        return f"META#HOST#{host_id}"

    @staticmethod
    def job_sk(host_id: str, job_id: str) -> str:
        return f"META#JOB#HOST#{host_id}#{job_id}"

    @staticmethod
    def host_prefix() -> str:
        return "META#HOST#"

    @staticmethod
    def job_prefix() -> str:
        return "META#JOB#"

    @staticmethod
    def job_host_prefix(host_id: str) -> str:
        return f"META#JOB#HOST#{host_id}#"

    @staticmethod
    def user_pk(user_id: str) -> str:
        return f"USER#{user_id}"

    @staticmethod
    def user_sk() -> str:
        return "META#USER"

    @staticmethod
    def workspace_membership_sk(user_id: str) -> str:
        return f"META#MEMBERSHIP#{user_id}"

    @staticmethod
    def workspace_membership_prefix() -> str:
        return "META#MEMBERSHIP#"

    @staticmethod
    def workspace_invitation_sk(invitation_id: str) -> str:
        return f"META#INVITATION#{invitation_id}"

    @staticmethod
    def workspace_invitation_prefix() -> str:
        return "META#INVITATION#"


class DynamoDBMappers:
    """Entity <-> DynamoDB item mappers."""

    @staticmethod
    def to_item(entity: BaseModel, pk: str, sk: str) -> dict[str, Any]:
        dictionary = entity.model_dump(mode="json", exclude_none=True)
        dictionary.update({"PK": pk, "SK": sk})
        return dictionary

    @staticmethod
    def from_item(item: dict[str, Any], entity_type: Type[T]) -> T:
        item = dict(item)
        item.pop("PK", None)
        item.pop("SK", None)
        return entity_type.model_validate(item)


class DynamoDBTable:
    """DynamoDB table operations wrapper."""

    def __init__(self, table: Any):
        self._table = table

    def put(self, item: dict) -> None:
        try:
            logger.debug("Putting item: PK=%s, SK=%s", item.get("PK"), item.get("SK"))
            self._table.put_item(Item=item)
            logger.debug(
                "Successfully put item: PK=%s, SK=%s", item.get("PK"), item.get("SK")
            )
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to put item: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            raise RepositoryException(
                f"Failed to put item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def get(self, pk: str, sk: str) -> dict | None:
        try:
            logger.debug("Getting item: PK=%s, SK=%s", pk, sk)
            response = self._table.get_item(Key={"PK": pk, "SK": sk})
            item = response.get("Item")
            if item:
                logger.debug("Found item: PK=%s, SK=%s", pk, sk)
            else:
                logger.debug("Item not found: PK=%s, SK=%s", pk, sk)
            return item
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to get item: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Table not found") from e
            raise RepositoryException(
                f"Failed to get item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def batch_get(self, keys: list[dict[str, str]]) -> list[dict]:
        """Get multiple items in batch. Keys must have PK and SK keys."""
        if not keys:
            return []

        table_name = self._table.name
        client = self._table.meta.client
        items: list[dict] = []

        try:
            logger.debug("Batch getting %d items", len(keys))
            for i in range(0, len(keys), 100):
                request_items = {table_name: {"Keys": keys[i : i + 100]}}
                while request_items:
                    response = client.batch_get_item(RequestItems=request_items)
                    items.extend(response.get("Responses", {}).get(table_name, []))
                    unprocessed = response.get("UnprocessedKeys", {})
                    request_items = unprocessed if unprocessed else {}
            logger.debug("Successfully batch got %d items", len(items))
            return items
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to batch get items: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Table not found") from e
            raise RepositoryException(
                f"Failed to batch get items: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def delete(self, pk: str, sk: str) -> None:
        try:
            logger.debug("Deleting item: PK=%s, SK=%s", pk, sk)
            self._table.delete_item(Key={"PK": pk, "SK": sk})
            logger.debug("Successfully deleted item: PK=%s, SK=%s", pk, sk)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to delete item: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            raise RepositoryException(
                f"Failed to delete item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def update(
        self,
        key: dict[str, str],
        update_expression: str,
        expression_attribute_values: dict[str, Any],
        expression_attribute_names: dict[str, str] | None = None,
        condition_expression: str | None = None,
    ) -> dict:
        try:
            logger.debug("Updating item: PK=%s, SK=%s", key.get("PK"), key.get("SK"))
            kwargs: dict[str, Any] = {
                "Key": key,
                "UpdateExpression": update_expression,
                "ExpressionAttributeValues": expression_attribute_values,
                "ReturnValues": "ALL_NEW",
            }
            if expression_attribute_names:
                kwargs["ExpressionAttributeNames"] = expression_attribute_names
            if condition_expression:
                kwargs["ConditionExpression"] = condition_expression
            response = self._table.update_item(**kwargs)
            return response.get("Attributes", {})
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to update item: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            if error_code == "ConditionalCheckFailedException":
                raise ConditionalCheckFailedError("Conditional check failed") from e
            raise RepositoryException(
                f"Failed to update item: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def batch_delete(self, items: list[dict]) -> None:
        """Delete multiple items in batch. Items must have PK and SK keys."""
        if not items:
            return

        try:
            logger.debug("Batch deleting %d items", len(items))
            with self._table.batch_writer() as batch:
                for item in items:
                    batch.delete_item(Key={"PK": item["PK"], "SK": item["SK"]})
            logger.debug("Successfully batch deleted %d items", len(items))
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to batch delete items: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            raise RepositoryException(
                f"Failed to batch delete items: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def query_begins_with(self, pk: str, sk_prefix: str) -> Iterable[dict]:
        try:
            logger.debug("Querying items: PK=%s, SK prefix=%s", pk, sk_prefix)
            last_evaluated_key = None
            total_count = 0
            while True:
                query_kwargs = {
                    "KeyConditionExpression": "PK = :pk AND begins_with(SK, :pfx)",
                    "ExpressionAttributeValues": {":pk": pk, ":pfx": sk_prefix},
                }
                if last_evaluated_key:
                    query_kwargs["ExclusiveStartKey"] = last_evaluated_key

                response = self._table.query(**query_kwargs)
                items = response.get("Items", [])
                total_count += len(items)
                yield from items

                last_evaluated_key = response.get("LastEvaluatedKey")
                if not last_evaluated_key:
                    break
            logger.debug(
                "Query returned %d items: PK=%s, SK prefix=%s",
                total_count,
                pk,
                sk_prefix,
            )
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to query items: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Table not found") from e
            raise RepositoryException(
                f"Failed to query items: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def query_all(self, pk: str) -> Iterable[dict]:
        try:
            logger.debug("Querying all items: PK=%s", pk)
            last_evaluated_key = None
            total_count = 0
            while True:
                query_kwargs = {
                    "KeyConditionExpression": "PK = :pk",
                    "ExpressionAttributeValues": {":pk": pk},
                }
                if last_evaluated_key:
                    query_kwargs["ExclusiveStartKey"] = last_evaluated_key

                response = self._table.query(**query_kwargs)
                items = response.get("Items", [])
                total_count += len(items)
                yield from items

                last_evaluated_key = response.get("LastEvaluatedKey")
                if not last_evaluated_key:
                    break
            logger.debug("Query returned %d items: PK=%s", total_count, pk)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to query items: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
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
            logger.debug(
                "Querying GSI: index=%s, %s=%s", index_name, key_name, key_value
            )
            last_evaluated_key = None
            total_count = 0
            while True:
                query_kwargs = {
                    "IndexName": index_name,
                    "KeyConditionExpression": f"{key_name} = :val",
                    "ExpressionAttributeValues": {":val": key_value},
                }
                if last_evaluated_key:
                    query_kwargs["ExclusiveStartKey"] = last_evaluated_key

                response = self._table.query(**query_kwargs)
                items = response.get("Items", [])
                total_count += len(items)
                yield from items

                last_evaluated_key = response.get("LastEvaluatedKey")
                if not last_evaluated_key:
                    break
            logger.debug(
                "GSI query returned %d items: index=%s", total_count, index_name
            )
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(
                "Failed to query GSI: %s - %s",
                error_code,
                e.response["Error"]["Message"],
            )
            if error_code == "ResourceNotFoundException":
                raise NotFoundException("Index not found") from e
            raise RepositoryException(
                f"Failed to query GSI: {error_code} - {e.response['Error']['Message']}"
            ) from e

    def transact_write(self, transact_items: list[dict]) -> None:
        """Execute a DynamoDB transactional write."""
        client = self._table.meta.client
        table_name = self._table.name

        normalized = []
        for transact_item in transact_items:
            operation = next(iter(transact_item))
            body = transact_item[operation]
            normalized.append({operation: {"TableName": table_name, **body}})

        client.transact_write_items(TransactItems=normalized)
