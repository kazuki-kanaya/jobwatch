from app.schemas.health import HealthResponse


class HealthService:
    def health(self) -> HealthResponse:
        return HealthResponse(ok=True)
