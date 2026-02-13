from app.dependencies.repositories import (
    get_host_repository,
    get_job_repository,
    get_workspace_invitation_repository,
    get_workspace_membership_repository,
    get_workspace_repository,
)
from app.dependencies.settings import get_settings
from app.services.health_service import HealthService
from app.services.host_service import HostService
from app.services.job_service import JobService
from app.services.user_service import UserService
from app.services.workspace_invitation_service import WorkspaceInvitationService
from app.services.workspace_service import WorkspaceService


def get_health_service() -> HealthService:
    return HealthService()


def get_workspace_service() -> WorkspaceService:
    workspace_repository = get_workspace_repository()
    workspace_membership_repository = get_workspace_membership_repository()
    return WorkspaceService(workspace_repository, workspace_membership_repository)


def get_host_service() -> HostService:
    host_repository = get_host_repository()
    return HostService(host_repository)


def get_job_service() -> JobService:
    job_repository = get_job_repository()
    return JobService(job_repository)


def get_user_service() -> UserService:
    workspace_repository = get_workspace_repository()
    workspace_membership_repository = get_workspace_membership_repository()
    return UserService(workspace_repository, workspace_membership_repository)


def get_workspace_invitation_service() -> WorkspaceInvitationService:
    settings = get_settings()
    workspace_repository = get_workspace_repository()
    workspace_membership_repository = get_workspace_membership_repository()
    workspace_invitation_repository = get_workspace_invitation_repository()
    return WorkspaceInvitationService(
        settings=settings,
        workspace_repository=workspace_repository,
        workspace_membership_repository=workspace_membership_repository,
        workspace_invitation_repository=workspace_invitation_repository,
    )
