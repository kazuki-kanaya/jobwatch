from datetime import datetime, timezone
from typing import Any

from app.database.billing_repository import BillingRepository
from app.integrations.stripe_gateway import StripeGatewayProtocol
from app.models.billing import (
    BillingAccount,
    Plan,
    SubscriptionStatus,
)
from app.models.exceptions import BadRequestException
from app.models.user import User
from app.schemas.billing import (
    BillingLimitsResponse,
    BillingResponse,
    BillingSessionResponse,
)
from app.services.entitlement_service import EntitlementService


PRO_SUBSCRIPTION_STATUSES = {
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.PAST_DUE,
    SubscriptionStatus.TRIALING,
}


class BillingService:
    def __init__(
        self,
        billing_repository: BillingRepository,
        entitlement_service: EntitlementService,
        stripe_gateway: StripeGatewayProtocol,
    ) -> None:
        self._billing_repository = billing_repository
        self._entitlement_service = entitlement_service
        self._stripe_gateway = stripe_gateway

    def get_billing(self, current_user: User) -> BillingResponse:
        account = self._get_account(current_user.user_id)
        entitlement = self._entitlement_service.get_for_user(current_user.user_id)
        return BillingResponse(
            plan=entitlement.plan,
            subscription_status=account.subscription_status,
            current_period_end=account.current_period_end,
            cancel_at_period_end=account.cancel_at_period_end,
            workspace_count=entitlement.workspace_count,
            limits=BillingLimitsResponse(**entitlement.limits.model_dump()),
            checkout_available=self._stripe_gateway.checkout_available,
            portal_available=(
                self._stripe_gateway.portal_available
                and account.stripe_customer_id is not None
            ),
        )

    def create_checkout(self, current_user: User) -> BillingSessionResponse:
        account = self._get_account(current_user.user_id)
        if account.plan is Plan.PRO and account.stripe_subscription_id:
            raise BadRequestException(
                "An active Pro subscription already exists; use the billing portal"
            )
        url = self._stripe_gateway.create_checkout_session(
            current_user.user_id,
            account.stripe_customer_id,
        )
        return BillingSessionResponse(url=url)

    def create_portal(self, current_user: User) -> BillingSessionResponse:
        account = self._get_account(current_user.user_id)
        if not account.stripe_customer_id:
            raise BadRequestException("No Stripe billing customer exists yet")
        url = self._stripe_gateway.create_portal_session(account.stripe_customer_id)
        return BillingSessionResponse(url=url)

    def handle_webhook(self, payload: bytes, signature: str) -> None:
        event = self._stripe_gateway.construct_event(payload, signature)
        event_id = self._string_value(event.get("id"))
        event_created = self._integer_value(event.get("created"))
        event_type = self._string_value(event.get("type"))
        if event_type is None:
            return
        event_id = event_id or ""
        event_object = self._event_object(event)
        user_id = self._webhook_user_id(event_type, event_object)
        if not user_id:
            return

        account = self._get_account(user_id)
        if self._is_duplicate_or_older(account, event_id, event_created):
            return

        if event_type == "checkout.session.completed":
            self._apply_checkout_completed(account, event_object)
        elif event_type in {
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
        }:
            self._apply_subscription_event(account, event_object)
        else:
            return

        account.last_stripe_event_id = event_id
        account.last_stripe_event_created = event_created
        account.touch()
        self._billing_repository.upsert(account)

    def _get_account(self, user_id: str) -> BillingAccount:
        return self._billing_repository.get(user_id) or BillingAccount(user_id=user_id)

    @staticmethod
    def _event_object(event: dict[str, Any]) -> dict[str, Any]:
        data = event.get("data")
        if not isinstance(data, dict):
            return {}
        obj = data.get("object")
        return obj if isinstance(obj, dict) else {}

    @staticmethod
    def _webhook_user_id(event_type: str, event_object: dict[str, Any]) -> str | None:
        if event_type == "checkout.session.completed":
            user_id = event_object.get("client_reference_id")
            if isinstance(user_id, str) and user_id:
                return user_id
        metadata = event_object.get("metadata")
        if isinstance(metadata, dict):
            user_id = metadata.get("user_id")
            if isinstance(user_id, str) and user_id:
                return user_id
        return None

    @staticmethod
    def _is_duplicate_or_older(
        account: BillingAccount,
        event_id: str,
        event_created: int | None,
    ) -> bool:
        if event_id and account.last_stripe_event_id == event_id:
            return True
        return bool(
            event_created is not None
            and account.last_stripe_event_created is not None
            and event_created < account.last_stripe_event_created
        )

    @staticmethod
    def _apply_checkout_completed(
        account: BillingAccount, event_object: dict[str, Any]
    ) -> None:
        account.plan = Plan.PRO
        account.subscription_status = SubscriptionStatus.ACTIVE
        account.stripe_customer_id = BillingService._string_value(
            event_object.get("customer")
        )
        account.stripe_subscription_id = BillingService._string_value(
            event_object.get("subscription")
        )

    @staticmethod
    def _apply_subscription_event(
        account: BillingAccount, event_object: dict[str, Any]
    ) -> None:
        status_value = BillingService._string_value(event_object.get("status"))
        if status_value is None:
            return
        try:
            status = SubscriptionStatus(status_value)
        except ValueError:
            return
        account.subscription_status = status
        account.plan = Plan.PRO if status in PRO_SUBSCRIPTION_STATUSES else Plan.FREE
        account.stripe_customer_id = (
            BillingService._string_value(event_object.get("customer"))
            or account.stripe_customer_id
        )
        account.stripe_subscription_id = (
            BillingService._string_value(event_object.get("id"))
            or account.stripe_subscription_id
        )
        account.current_period_end = BillingService._timestamp(
            event_object.get("current_period_end")
        )
        account.cancel_at_period_end = bool(
            event_object.get("cancel_at_period_end", False)
        )

    @staticmethod
    def _string_value(value: Any) -> str | None:
        return value if isinstance(value, str) and value else None

    @staticmethod
    def _integer_value(value: Any) -> int | None:
        if isinstance(value, (int, float)):
            return int(value)
        return None

    @staticmethod
    def _timestamp(value: Any) -> datetime | None:
        if isinstance(value, (int, float)):
            return datetime.fromtimestamp(value, tz=timezone.utc)
        return None
