from app.config import Settings


def oidc_settings(**overrides) -> Settings:
    return Settings(
        oidc_jwks_url="https://issuer.example/.well-known/jwks.json",
        oidc_audience="client-id",
        oidc_issuer="https://issuer.example",
        **overrides,
    )


def test_billing_is_disabled_by_default() -> None:
    settings = oidc_settings()

    assert settings.stripe_secret_key is None
    assert settings.stripe_webhook_secret is None
    assert settings.stripe_pro_price_id is None


def test_billing_settings_expose_stripe_and_redirect_configuration() -> None:
    settings = oidc_settings(
        stripe_secret_key="sk_test_123",
        stripe_webhook_secret="whsec_123",
        stripe_pro_price_id="price_pro",
        billing_success_url="https://obsern.dev/billing/success",
        billing_cancel_url="https://obsern.dev/billing/cancel",
        billing_portal_return_url="https://obsern.dev/billing",
    )

    assert settings.stripe_secret_key == "sk_test_123"
    assert settings.stripe_webhook_secret == "whsec_123"
    assert settings.stripe_pro_price_id == "price_pro"
    assert settings.billing_success_url == "https://obsern.dev/billing/success"
    assert settings.billing_cancel_url == "https://obsern.dev/billing/cancel"
    assert settings.billing_portal_return_url == "https://obsern.dev/billing"
