from datetime import datetime, timezone
from typing import cast

import pytest

from app.database.billing_repository import BillingRepository
from app.models.billing import BillingAccount, Plan, SubscriptionStatus, get_plan_limits
from app.models.exceptions import BadRequestException
from app.models.user import User
from app.services.billing_service import BillingService
from app.services.entitlement_service import EntitlementService, EntitlementSnapshot


class FakeBillingRepository:
    def __init__(self, account: BillingAccount | None = None) -> None:
        self.account = account
        self.upserted: list[BillingAccount] = []

    def get(self, user_id: str) -> BillingAccount | None:
        return self.account

    def upsert(self, account: BillingAccount) -> BillingAccount:
        self.account = account
        self.upserted.append(account)
        return account


class FakeEntitlementService:
    def get_for_user(self, user_id: str) -> EntitlementSnapshot:
        account = BillingAccount(user_id=user_id)
        return EntitlementSnapshot(
            user_id=user_id,
            plan=account.plan,
            limits=get_plan_limits(account.plan),
            workspace_count=0,
        )


class FakeStripeGateway:
    def __init__(self, event: dict | None = None) -> None:
        self.event = event
        self.checkout_args: tuple[str, str | None] | None = None
        self.portal_customer_id: str | None = None

    @property
    def checkout_available(self) -> bool:
        return True

    @property
    def portal_available(self) -> bool:
        return True

    def create_checkout_session(self, user_id: str, customer_id: str | None) -> str:
        self.checkout_args = (user_id, customer_id)
        return "https://checkout.stripe.com/session"

    def create_portal_session(self, customer_id: str) -> str:
        self.portal_customer_id = customer_id
        return "https://billing.stripe.com/session"

    def construct_event(self, payload: bytes, signature: str) -> dict:
        return self.event or {}


def test_billing_service_creates_checkout_for_the_current_account() -> None:
    repository = FakeBillingRepository(
        BillingAccount(user_id="user-1", stripe_customer_id="cus_123")
    )
    gateway = FakeStripeGateway()
    service = BillingService(
        cast(BillingRepository, repository),
        cast(EntitlementService, FakeEntitlementService()),
        gateway,
    )

    response = service.create_checkout(User(user_id="user-1", name="Researcher"))

    assert response.url == "https://checkout.stripe.com/session"
    assert gateway.checkout_args == ("user-1", "cus_123")


def test_billing_service_requires_a_customer_for_portal() -> None:
    repository = FakeBillingRepository(BillingAccount(user_id="user-1"))
    service = BillingService(
        cast(BillingRepository, repository),
        cast(EntitlementService, FakeEntitlementService()),
        FakeStripeGateway(),
    )

    with pytest.raises(BadRequestException, match="customer"):
        service.create_portal(User(user_id="user-1", name="Researcher"))


def test_checkout_webhook_activates_pro_and_is_safe_to_retry() -> None:
    event = {
        "id": "evt_checkout_1",
        "created": 100,
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "client_reference_id": "user-1",
                "customer": "cus_123",
                "subscription": "sub_123",
            }
        },
    }
    repository = FakeBillingRepository()
    service = BillingService(
        cast(BillingRepository, repository),
        cast(EntitlementService, FakeEntitlementService()),
        FakeStripeGateway(event),
    )

    service.handle_webhook(b"{}", "sig")
    service.handle_webhook(b"{}", "sig")

    assert repository.account is not None
    assert repository.account.plan is Plan.PRO
    assert repository.account.subscription_status is SubscriptionStatus.ACTIVE
    assert repository.account.stripe_customer_id == "cus_123"
    assert repository.account.stripe_subscription_id == "sub_123"
    assert repository.account.last_stripe_event_id == "evt_checkout_1"
    assert len(repository.upserted) == 1


def test_subscription_webhook_updates_status_and_period_end() -> None:
    event = {
        "id": "evt_subscription_1",
        "created": 101,
        "type": "customer.subscription.updated",
        "data": {
            "object": {
                "metadata": {"user_id": "user-1"},
                "customer": "cus_123",
                "id": "sub_123",
                "status": "active",
                "current_period_end": 1_700_000_000,
                "cancel_at_period_end": True,
            }
        },
    }
    repository = FakeBillingRepository()
    service = BillingService(
        cast(BillingRepository, repository),
        cast(EntitlementService, FakeEntitlementService()),
        FakeStripeGateway(event),
    )

    service.handle_webhook(b"{}", "sig")

    assert repository.account is not None
    assert repository.account.plan is Plan.PRO
    assert repository.account.subscription_status is SubscriptionStatus.ACTIVE
    assert repository.account.current_period_end == datetime.fromtimestamp(
        1_700_000_000, tz=timezone.utc
    )
    assert repository.account.cancel_at_period_end is True
