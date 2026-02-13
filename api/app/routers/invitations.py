from fastapi import APIRouter, Depends

from app.dependencies.security import get_current_user
from app.dependencies.services import get_workspace_invitation_service
from app.models.user import User
from app.schemas.invitation import InvitationAcceptRequest, InvitationAcceptResponse
from app.services.workspace_invitation_service import WorkspaceInvitationService

router = APIRouter(prefix="/invitations", tags=["invitations"])


@router.post("/accept", response_model=InvitationAcceptResponse)
def accept_invitation(
    request: InvitationAcceptRequest,
    invitation_service: WorkspaceInvitationService = Depends(
        get_workspace_invitation_service
    ),
    current_user: User = Depends(get_current_user),
) -> InvitationAcceptResponse:
    """Accept workspace invitation by token."""
    return invitation_service.accept_invitation(request, current_user)
