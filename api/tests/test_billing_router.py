from typing import cast

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.dependencies.security import get_current_user
from app.dependencies.services import get_billing_service
from app.exception_handlers import register_exception_handlers
from app.models.billing import Plan
from app.models.exceptions import BadRequestException
from app.models.user import User
from app.routers.billing import router
from app.schemas.billing import (
    BillingLimitsResponse,
    BillingResponse,
    BillingSessionResponse,
)
from app.services.billing_service import BillingService


class FakeBillingService:
    def __init__(self, invalid_webhook: bool = False) -> None:
        self.invalid_webhook = invalid_webhook
        self.received_webhook: tuple[bytes, str] | None = None

    def get_billing(self, current_user: User) -> BillingResponse:
        return BillingResponse(
            plan=Plan.FREE,
            subscription_status=None,
            current_period_end=None,
            cancel_at_period_end=False,
            workspace_count=0,
            limits=BillingLimitsResponse(
                max_workspaces=1,
                max_hosts_per_workspace=1,
                max_jobs_per_workspace=30,
                max_log_lines_per_job=15,
                retention_days=7,
            ),
            checkout_available=True,
            portal_available=False,
        )

    def create_checkout(self, current_user: User) -> BillingSessionResponse:
        return BillingSessionResponse(url="https://checkout.stripe.com/session")

    def create_portal(self, current_user: User) -> BillingSessionResponse:
        return BillingSessionResponse(url="https://billing.stripe.com/session")

    def handle_webhook(self, payload: bytes, signature: str) -> None:
        if self.invalid_webhook:
            raise BadRequestException("Invalid Stripe webhook signature")
        self.received_webhook = (payload, signature)


def client_for(service: FakeBillingService) -> TestClient:
    app = FastAPI()
    app.include_router(router)
    register_exception_handlers(app)
    app.dependency_overrides[get_current_user] = lambda: User(
        user_id="user-1", name="Researcher"
    )
    app.dependency_overrides[get_billing_service] = lambda: cast(
        BillingService, service
    )
    return TestClient(app)


def test_get_billing_returns_plan_and_limits() -> None:
    response = client_for(FakeBillingService()).get("/billing")

    assert response.status_code == 200
    assert response.json()["plan"] == "free"
    assert response.json()["limits"]["max_workspaces"] == 1


def test_checkout_endpoint_returns_stripe_hosted_url() -> None:
    response = client_for(FakeBillingService()).post("/billing/checkout")

    assert response.status_code == 200
    assert response.json() == {"url": "https://checkout.stripe.com/session"}


def test_webhook_passes_raw_body_and_signature_to_service() -> None:
    service = FakeBillingService()
    response = client_for(service).post(
        "/webhooks/stripe",
        content=b'{"id":"evt_123"}',
        headers={"stripe-signature": "t=123,v1=signature"},
    )

    assert response.status_code == 200
    assert response.json() == {"received": True}
    assert service.received_webhook == (
        b'{"id":"evt_123"}',
        "t=123,v1=signature",
    )


def test_invalid_webhook_returns_bad_request() -> None:
    response = client_for(FakeBillingService(invalid_webhook=True)).post(
        "/webhooks/stripe",
        content=b"invalid",
        headers={"stripe-signature": "invalid"},
    )

    assert response.status_code == 400
