from typing import Any
from decimal import Decimal

from app.database.client import DynamoDBKeys, DynamoDBTable
from app.models.exceptions import ConditionalCheckFailedError
from app.utils.datetime import now


class WorkspaceQuotaRepository:
    """Stores the strongly consistent owned-workspace counter for a user."""

    _COUNT_ATTRIBUTE = "owned_workspace_count"

    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def get(self, user_id: str) -> int | None:
        item = self._table.get(
            DynamoDBKeys.user_pk(user_id),
            DynamoDBKeys.workspace_quota_sk(),
            consistent_read=True,
        )
        if item is None:
            return None
        count = item.get(self._COUNT_ATTRIBUTE)
        if isinstance(count, (int, Decimal)):
            return int(count)
        return None

    def initialize_if_missing(self, user_id: str, count: int) -> None:
        try:
            self._table.update(
                key=self._key(user_id),
                update_expression=("SET #count = :count, #updated_at = :updated_at"),
                expression_attribute_names={
                    "#count": self._COUNT_ATTRIBUTE,
                    "#updated_at": "updated_at",
                },
                expression_attribute_values={
                    ":count": count,
                    ":updated_at": now().isoformat(),
                },
                condition_expression="attribute_not_exists(#count)",
            )
        except ConditionalCheckFailedError:
            pass

    def increment_item(
        self,
        user_id: str,
        expected_count: int,
        max_count: int,
    ) -> dict[str, Any]:
        return {
            "Update": {
                "Key": self._key(user_id),
                "UpdateExpression": (
                    "SET #count = #count + :one, #updated_at = :updated_at"
                ),
                "ConditionExpression": (
                    "attribute_exists(PK) AND #count = :expected "
                    "AND #count < :max_count"
                ),
                "ExpressionAttributeNames": {
                    "#count": self._COUNT_ATTRIBUTE,
                    "#updated_at": "updated_at",
                },
                "ExpressionAttributeValues": {
                    ":one": 1,
                    ":expected": expected_count,
                    ":max_count": max_count,
                    ":updated_at": now().isoformat(),
                },
            }
        }

    def decrement_item(self, user_id: str) -> dict[str, Any]:
        return {
            "Update": {
                "Key": self._key(user_id),
                "UpdateExpression": (
                    "SET #count = #count - :one, #updated_at = :updated_at"
                ),
                "ConditionExpression": ("attribute_exists(PK) AND #count >= :one"),
                "ExpressionAttributeNames": {
                    "#count": self._COUNT_ATTRIBUTE,
                    "#updated_at": "updated_at",
                },
                "ExpressionAttributeValues": {
                    ":one": 1,
                    ":updated_at": now().isoformat(),
                },
            }
        }

    @staticmethod
    def _key(user_id: str) -> dict[str, str]:
        return {
            "PK": DynamoDBKeys.user_pk(user_id),
            "SK": DynamoDBKeys.workspace_quota_sk(),
        }
