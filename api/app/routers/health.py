from fastapi import APIRouter, Depends

from app.dependencies.services import get_health_service
from app.schemas.health import HealthResponse
from app.services.health_service import HealthService

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse)
async def health(
    health_service: HealthService = Depends(get_health_service),
) -> HealthResponse:
    return health_service.health()
