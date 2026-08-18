from fastapi import APIRouter, Depends, Request

from app.dependencies.security import get_current_user
from app.dependencies.services import get_billing_service
from app.models.user import User
from app.schemas.billing import (
    BillingResponse,
    BillingSessionResponse,
    BillingWebhookResponse,
)
from app.services.billing_service import BillingService

router = APIRouter(tags=["billing"])


@router.get("/billing", response_model=BillingResponse)
def get_billing(
    billing_service: BillingService = Depends(get_billing_service),
    current_user: User = Depends(get_current_user),
) -> BillingResponse:
    return billing_service.get_billing(current_user)


@router.post("/billing/checkout", response_model=BillingSessionResponse)
def create_checkout(
    billing_service: BillingService = Depends(get_billing_service),
    current_user: User = Depends(get_current_user),
) -> BillingSessionResponse:
    return billing_service.create_checkout(current_user)


@router.post("/billing/portal", response_model=BillingSessionResponse)
def create_portal(
    billing_service: BillingService = Depends(get_billing_service),
    current_user: User = Depends(get_current_user),
) -> BillingSessionResponse:
    return billing_service.create_portal(current_user)


@router.post("/webhooks/stripe", response_model=BillingWebhookResponse)
async def receive_stripe_webhook(
    request: Request,
    billing_service: BillingService = Depends(get_billing_service),
) -> BillingWebhookResponse:
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")
    billing_service.handle_webhook(payload, signature)
    return BillingWebhookResponse(received=True)
