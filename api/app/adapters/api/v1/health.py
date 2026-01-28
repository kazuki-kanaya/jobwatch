from fastapi import APIRouter

from app.adapters.api.schemas.health import HealthResponse

health_router = APIRouter(prefix="/health", tags=["health"])


@health_router.get("", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(ok=True)
