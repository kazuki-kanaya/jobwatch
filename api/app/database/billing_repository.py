from typing import Any

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.billing import BillingAccount
from app.models.exceptions import ConditionalCheckFailedError


class BillingRepository:
    def __init__(self, table: DynamoDBTable) -> None:
        self._table = table

    def get(self, user_id: str) -> BillingAccount | None:
        item = self._table.get(
            DynamoDBKeys.user_pk(user_id),
            DynamoDBKeys.billing_sk(),
        )
        if item is None:
            return None
        return DynamoDBMappers.from_item(item, BillingAccount)

    def upsert(self, account: BillingAccount) -> BillingAccount:
        self._table.put(self._to_item(account))
        return account

    def apply_webhook(
        self,
        account: BillingAccount,
        event_id: str,
        event_created: int | None,
    ) -> bool:
        """Apply one Stripe event exactly once with its billing state update."""
        event_item: dict[str, Any] = {
            "PK": DynamoDBKeys.user_pk(account.user_id),
            "SK": DynamoDBKeys.stripe_event_sk(event_id),
            "event_id": event_id,
        }
        if event_created is not None:
            event_item["event_created"] = event_created

        billing_operation: dict[str, Any] = {
            "Item": self._to_item(account),
        }
        if event_created is None:
            billing_operation["ConditionExpression"] = (
                "attribute_not_exists(PK) "
                "OR attribute_not_exists(last_stripe_event_created)"
            )
        else:
            billing_operation["ConditionExpression"] = (
                "attribute_not_exists(PK) "
                "OR attribute_not_exists(last_stripe_event_created) "
                "OR last_stripe_event_created <= :event_created"
            )
            billing_operation["ExpressionAttributeValues"] = {
                ":event_created": event_created
            }

        try:
            self._table.transact_write(
                [
                    {
                        "Put": {
                            "Item": event_item,
                            "ConditionExpression": "attribute_not_exists(PK)",
                        }
                    },
                    {"Put": billing_operation},
                ]
            )
        except ConditionalCheckFailedError:
            return False
        return True

    @staticmethod
    def _to_item(account: BillingAccount) -> dict[str, Any]:
        return DynamoDBMappers.to_item(
            account,
            DynamoDBKeys.user_pk(account.user_id),
            DynamoDBKeys.billing_sk(),
        )
