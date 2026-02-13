from fastapi import APIRouter, Depends

from app.dependencies.security import get_current_user
from app.dependencies.services import get_user_service
from app.models.user import User
from app.schemas.user import UserResponse, UserWorkspacesResponse
from app.services.user_service import UserService


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Get the current authenticated user."""
    return user_service.read_current_user(current_user)


@router.get("/me/workspaces", response_model=UserWorkspacesResponse)
def list_user_workspaces(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
) -> UserWorkspacesResponse:
    """List all workspaces the current user has access to."""
    return user_service.list_user_workspaces(current_user)
