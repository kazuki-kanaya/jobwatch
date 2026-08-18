from typing import cast

from app.database.billing_repository import BillingRepository
from app.database.client import DynamoDBKeys, DynamoDBTable
from app.models.billing import BillingAccount, Plan, SubscriptionStatus


class FakeTable:
    def __init__(self) -> None:
        self.items: dict[tuple[str, str], dict] = {}

    def get(self, pk: str, sk: str) -> dict | None:
        return self.items.get((pk, sk))

    def put(self, item: dict) -> None:
        self.items[(item["PK"], item["SK"])] = item


def test_billing_repository_reads_the_user_billing_item() -> None:
    table = FakeTable()
    table.put(
        {
            "PK": "USER#user-1",
            "SK": "META#BILLING",
            "user_id": "user-1",
            "plan": "pro",
            "subscription_status": "active",
        }
    )

    account = BillingRepository(cast(DynamoDBTable, table)).get("user-1")

    assert account is not None
    assert account.user_id == "user-1"
    assert account.plan is Plan.PRO
    assert account.subscription_status is SubscriptionStatus.ACTIVE


def test_billing_repository_upserts_the_user_billing_item() -> None:
    table = FakeTable()
    account = BillingAccount(user_id="user-1", plan=Plan.PRO)

    BillingRepository(cast(DynamoDBTable, table)).upsert(account)

    assert table.items[("USER#user-1", DynamoDBKeys.billing_sk())]["plan"] == "pro"
