from typing import Any, Protocol

import stripe

from app.config import Settings
from app.models.exceptions import BadRequestException


class StripeGatewayProtocol(Protocol):
    @property
    def checkout_available(self) -> bool: ...

    @property
    def portal_available(self) -> bool: ...

    def create_checkout_session(
        self, user_id: str, customer_id: str | None, idempotency_key: str
    ) -> str: ...

    def create_portal_session(self, customer_id: str) -> str: ...

    def construct_event(self, payload: bytes, signature: str) -> dict[str, Any]: ...


class StripeGateway:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    @property
    def checkout_available(self) -> bool:
        return bool(
            self._settings.stripe_secret_key and self._settings.stripe_pro_price_id
        )

    @property
    def portal_available(self) -> bool:
        return bool(self._settings.stripe_secret_key)

    def create_checkout_session(
        self, user_id: str, customer_id: str | None, idempotency_key: str
    ) -> str:
        self._require_checkout_configuration()
        params: dict[str, Any] = {
            "mode": "subscription",
            "line_items": [
                {"price": self._settings.stripe_pro_price_id, "quantity": 1}
            ],
            "success_url": self._settings.billing_success_url,
            "cancel_url": self._settings.billing_cancel_url,
            "client_reference_id": user_id,
            "metadata": {"user_id": user_id},
            "subscription_data": {"metadata": {"user_id": user_id}},
        }
        if customer_id:
            params["customer"] = customer_id

        session = self._create_checkout_session(params, idempotency_key)
        url = session.get("url")
        if not isinstance(url, str) or not url:
            raise BadRequestException("Stripe checkout did not return a URL")
        return url

    def create_portal_session(self, customer_id: str) -> str:
        self._require_secret_key()
        try:
            stripe.api_key = self._settings.stripe_secret_key
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=self._settings.billing_portal_return_url,
            )
        except stripe.StripeError as exc:
            raise BadRequestException(
                "Stripe portal session could not be created"
            ) from exc
        url = self._to_dict(session).get("url")
        if not isinstance(url, str) or not url:
            raise BadRequestException("Stripe portal did not return a URL")
        return url

    def construct_event(self, payload: bytes, signature: str) -> dict[str, Any]:
        webhook_secret = self._settings.stripe_webhook_secret
        if not webhook_secret:
            raise BadRequestException("Stripe webhook is not configured")
        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                webhook_secret,
            )
        except (ValueError, stripe.SignatureVerificationError) as exc:
            raise BadRequestException("Invalid Stripe webhook signature") from exc
        return self._to_dict(event)

    def _create_checkout_session(
        self, params: dict[str, Any], idempotency_key: str
    ) -> dict[str, Any]:
        try:
            stripe.api_key = self._settings.stripe_secret_key
            session = stripe.checkout.Session.create(
                idempotency_key=idempotency_key,
                **params,
            )
        except stripe.StripeError as exc:
            raise BadRequestException(
                "Stripe checkout session could not be created"
            ) from exc
        return self._to_dict(session)

    def _require_checkout_configuration(self) -> None:
        if not self.checkout_available:
            raise BadRequestException("Stripe checkout is not configured")

    def _require_secret_key(self) -> None:
        if not self._settings.stripe_secret_key:
            raise BadRequestException("Stripe is not configured")

    @staticmethod
    def _to_dict(value: Any) -> dict[str, Any]:
        if isinstance(value, dict):
            return value
        if hasattr(value, "to_dict_recursive"):
            return value.to_dict_recursive()
        raise BadRequestException("Stripe returned an invalid response")
