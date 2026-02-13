from app.database.host_repository import HostRepository
from app.database.job_repository import JobRepository
from app.database.user_repository import UserRepository
from app.database.workspace_invitation_repository import WorkspaceInvitationRepository
from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.database.workspace_repository import WorkspaceRepository
from app.dependencies.settings import get_dynamodb_table


def get_workspace_repository() -> WorkspaceRepository:
    table = get_dynamodb_table()
    return WorkspaceRepository(table)


def get_host_repository() -> HostRepository:
    table = get_dynamodb_table()
    return HostRepository(table)


def get_job_repository() -> JobRepository:
    table = get_dynamodb_table()
    return JobRepository(table)


def get_user_repository() -> UserRepository:
    table = get_dynamodb_table()
    return UserRepository(table)


def get_workspace_membership_repository() -> WorkspaceMembershipRepository:
    table = get_dynamodb_table()
    return WorkspaceMembershipRepository(table)


def get_workspace_invitation_repository() -> WorkspaceInvitationRepository:
    table = get_dynamodb_table()
    return WorkspaceInvitationRepository(table)
