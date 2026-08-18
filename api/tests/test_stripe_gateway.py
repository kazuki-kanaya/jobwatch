import stripe
import pytest

from app.config import Settings
from app.integrations.stripe_gateway import StripeGateway
from app.models.exceptions import BadRequestException


def settings() -> Settings:
    return Settings(
        oidc_jwks_url="https://issuer.example/.well-known/jwks.json",
        oidc_audience="client-id",
        oidc_issuer="https://issuer.example",
        stripe_secret_key="sk_test_123",
        stripe_webhook_secret="whsec_123",
        stripe_pro_price_id="price_pro",
        billing_success_url="https://obsern.dev/billing/success",
        billing_cancel_url="https://obsern.dev/billing/cancel",
        billing_portal_return_url="https://obsern.dev/billing",
    )


def test_checkout_gateway_creates_a_pro_subscription_session(monkeypatch) -> None:
    calls: list[dict] = []

    def create_session(**params):
        calls.append(params)
        return {"url": "https://checkout.stripe.com/cs_test"}

    monkeypatch.setattr(stripe.checkout.Session, "create", create_session)

    url = StripeGateway(settings()).create_checkout_session(
        "user-1", "cus_123", "checkout:user-1:cus_123:none"
    )

    assert url == "https://checkout.stripe.com/cs_test"
    assert calls == [
        {
            "mode": "subscription",
            "line_items": [{"price": "price_pro", "quantity": 1}],
            "success_url": "https://obsern.dev/billing/success",
            "cancel_url": "https://obsern.dev/billing/cancel",
            "customer": "cus_123",
            "client_reference_id": "user-1",
            "metadata": {"user_id": "user-1"},
            "subscription_data": {"metadata": {"user_id": "user-1"}},
            "idempotency_key": "checkout:user-1:cus_123:none",
        }
    ]


def test_portal_gateway_creates_a_customer_portal_session(monkeypatch) -> None:
    calls: list[dict] = []

    def create_session(**params):
        calls.append(params)
        return {"url": "https://billing.stripe.com/session"}

    monkeypatch.setattr(stripe.billing_portal.Session, "create", create_session)

    url = StripeGateway(settings()).create_portal_session("cus_123")

    assert url == "https://billing.stripe.com/session"
    assert calls == [
        {
            "customer": "cus_123",
            "return_url": "https://obsern.dev/billing",
        }
    ]


def test_webhook_gateway_verifies_the_raw_payload(monkeypatch) -> None:
    calls: list[tuple[bytes, str, str]] = []

    def construct_event(payload: bytes, signature: str, secret: str) -> dict:
        calls.append((payload, signature, secret))
        return {"id": "evt_123", "type": "checkout.session.completed"}

    monkeypatch.setattr(stripe.Webhook, "construct_event", construct_event)

    event = StripeGateway(settings()).construct_event(b"raw-body", "signature")

    assert event["id"] == "evt_123"
    assert calls == [(b"raw-body", "signature", "whsec_123")]


def test_webhook_gateway_rejects_an_invalid_signature(monkeypatch) -> None:
    def construct_event(payload: bytes, signature: str, secret: str) -> None:
        raise ValueError("invalid signature")

    monkeypatch.setattr(stripe.Webhook, "construct_event", construct_event)

    with pytest.raises(BadRequestException, match="Invalid Stripe webhook"):
        StripeGateway(settings()).construct_event(b"raw-body", "signature")
