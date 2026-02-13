import http
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.models.exceptions import (
    AuthenticationError,
    ConditionalCheckFailedError,
    NotFoundException,
    PermissionDeniedError,
    RepositoryException,
)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AuthenticationError)
    async def handle_authentication_error(
        request: Request, exception: AuthenticationError
    ) -> JSONResponse:
        """Handle authentication errors with 401 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.UNAUTHORIZED,
            content={"detail": str(exception)},
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.exception_handler(NotFoundException)
    async def handle_not_found_error(
        request: Request, exception: NotFoundException
    ) -> JSONResponse:
        """Handle not found errors with 404 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.NOT_FOUND,
            content={"detail": str(exception)},
        )

    @app.exception_handler(PermissionDeniedError)
    async def handle_permission_denied_error(
        request: Request, exception: PermissionDeniedError
    ) -> JSONResponse:
        """Handle permission denied errors with 403 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.FORBIDDEN,
            content={"detail": str(exception)},
        )

    @app.exception_handler(ConditionalCheckFailedError)
    async def handle_conditional_check_failed_error(
        request: Request, exception: ConditionalCheckFailedError
    ) -> JSONResponse:
        """Handle conditional check failures with 409 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.CONFLICT,
            content={"detail": str(exception)},
        )

    @app.exception_handler(RepositoryException)
    async def handle_repository_error(
        request: Request, exception: RepositoryException
    ) -> JSONResponse:
        """Handle repository errors with 500 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR,
            content={"detail": str(exception)},
        )
