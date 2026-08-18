from typing import Any

from app.database.client import DynamoDBKeys, DynamoDBMappers, DynamoDBTable
from app.models.billing import BillingAccount


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

    @staticmethod
    def _to_item(account: BillingAccount) -> dict[str, Any]:
        return DynamoDBMappers.to_item(
            account,
            DynamoDBKeys.user_pk(account.user_id),
            DynamoDBKeys.billing_sk(),
        )
