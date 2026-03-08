import { useEffect, useMemo } from "react";
import { useAuth } from "react-oidc-context";
import type { CurrentUser } from "@/features/user";
import { useWorkspaceQueries } from "@/features/workspace/api/useWorkspaceQueries";
import type { WorkspaceViewState } from "@/features/workspace/components/types";
import { WorkspaceCreateButton } from "@/features/workspace/components/WorkspaceCreateButton/WorkspaceCreateButton";
import { WorkspaceDeleteDialog } from "@/features/workspace/components/WorkspaceDeleteDialog/WorkspaceDeleteDialog";
import { WorkspaceFormDialog } from "@/features/workspace/components/WorkspaceFormDialog/WorkspaceFormDialog";
import { WorkspaceList } from "@/features/workspace/components/WorkspaceList/WorkspaceList";
import { WorkspaceSection } from "@/features/workspace/components/WorkspaceSection/WorkspaceSection";
import { WorkspaceSummary } from "@/features/workspace/components/WorkspaceSummary/WorkspaceSummary";
import { WorkspaceTransferDialog } from "@/features/workspace/components/WorkspaceTransferDialog/WorkspaceTransferDialog";
import { useWorkspaceCrud } from "@/features/workspace/hooks/useWorkspaceCrud";
import { useLocale } from "@/i18n/LocaleProvider";

type WorkspaceFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
  onWorkspaceIdChange: (workspaceId: string) => void;
};

export function WorkspaceFeature({ workspaceId, currentUser, onWorkspaceIdChange }: WorkspaceFeatureProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canCreate = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  const { workspacesQuery, membersQuery, usersLookupQuery } = useWorkspaceQueries({
    accessToken,
    enabled: canCreate,
    workspaceId,
  });

  const workspaces = useMemo(() => {
    const items = workspacesQuery.data?.workspaces ?? [];
    return items.map((workspace) => ({
      id: workspace.workspace_id,
      name: workspace.name,
    }));
  }, [workspacesQuery.data]);

  useEffect(() => {
    if (!workspaceId && workspaces.length > 0) {
      onWorkspaceIdChange(workspaces[0].id);
    }
  }, [onWorkspaceIdChange, workspaceId, workspaces]);

  const activeWorkspace = workspaces.find((workspace) => workspace.id === workspaceId) ?? workspaces[0];
  const activeWorkspaceId = activeWorkspace?.id ?? "";
  const selectedWorkspaceName = activeWorkspace?.name ?? "-";

  const userNameById = useMemo(() => {
    const users = usersLookupQuery.data?.users ?? [];
    return users.reduce<Record<string, string>>((acc, user) => {
      acc[user.user_id] = user.name;
      return acc;
    }, {});
  }, [usersLookupQuery.data]);

  const ownerOptions = useMemo(() => {
    const members = membersQuery.data?.members ?? [];
    return members.map((member) => ({
      id: member.user_id,
      name: userNameById[member.user_id] ? `${userNameById[member.user_id]} (${member.user_id})` : member.user_id,
    }));
  }, [membersQuery.data, userNameById]);

  const currentMembershipRole =
    currentUser?.id && membersQuery.data?.members
      ? (membersQuery.data.members.find((member) => member.user_id === currentUser.id)?.role ?? null)
      : null;
  const canManage = currentMembershipRole === "owner";

  const viewState: WorkspaceViewState = workspacesQuery.isLoading
    ? "loading"
    : workspacesQuery.isError
      ? "error"
      : workspaces.length === 0
        ? "empty"
        : "ready";
  const isLoading = viewState === "loading";
  const isError = viewState === "error";

  const workspaceCrud = useWorkspaceCrud({
    accessToken,
    workspaceId: activeWorkspaceId,
    workspaces,
    onWorkspaceIdChange,
    texts: {
      workspaceCreated: t("dashboard_workspace_created"),
      workspaceUpdated: t("dashboard_workspace_updated"),
      workspaceDeleted: t("dashboard_workspace_deleted"),
      workspaceOwnerTransferred: t("dashboard_workspace_owner_transferred"),
      workspaceCrudError: t("dashboard_workspace_crud_error"),
      invitationRevoked: t("dashboard_invitation_revoked"),
      invitationCrudError: t("dashboard_invitation_crud_error"),
    },
  });

  return (
    <WorkspaceSection
      title={t("dashboard_workspaces")}
      headerActions={
        <WorkspaceCreateButton
          addLabel={t("dashboard_add")}
          noPermissionLabel={t("dashboard_no_permission")}
          canCreate={canCreate}
          onCreateWorkspace={workspaceCrud.openWorkspaceCreateForm}
        />
      }
      summary={
        <WorkspaceSummary
          title={t("dashboard_current_workspace")}
          workspaceId={activeWorkspaceId || "-"}
          workspaceName={selectedWorkspaceName}
          hint={t("dashboard_workspace_scope_hint")}
        />
      }
      content={
        <WorkspaceList
          items={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={t("dashboard_workspaces_empty")}
          errorLabel={t("dashboard_workspaces_error")}
          editLabel={t("dashboard_edit")}
          transferOwnerLabel={t("dashboard_workspace_transfer_owner")}
          deleteLabel={t("dashboard_delete")}
          canManage={canManage}
          onSelectWorkspace={onWorkspaceIdChange}
          onEditWorkspace={workspaceCrud.startEditWorkspace}
          onTransferWorkspaceOwner={workspaceCrud.openTransferOwnerDialog}
          onDeleteWorkspace={workspaceCrud.requestDeleteWorkspace}
        />
      }
      dialogs={
        <>
          <WorkspaceFormDialog
            title={workspaceCrud.editingWorkspaceId ? t("dashboard_edit") : t("dashboard_add")}
            description={t("dashboard_workspace_scope_hint")}
            workspaceNameLabel={t("dashboard_workspace_name")}
            createLabel={t("dashboard_add")}
            updateLabel={t("dashboard_edit")}
            cancelLabel={t("dashboard_cancel")}
            workspaceDraftName={workspaceCrud.workspaceDraftName}
            isEditing={workspaceCrud.editingWorkspaceId !== null}
            isSubmitting={workspaceCrud.isWorkspaceSubmitting}
            isOpen={workspaceCrud.isWorkspaceFormOpen}
            onClose={workspaceCrud.closeWorkspaceForm}
            onWorkspaceDraftNameChange={workspaceCrud.setWorkspaceDraftName}
            onSubmit={workspaceCrud.submitWorkspace}
          />

          <WorkspaceTransferDialog
            title={t("dashboard_workspace_transfer_owner")}
            description={t("dashboard_workspace_scope_hint")}
            ownerUserIdLabel={t("dashboard_workspace_new_owner_user_id")}
            transferLabel={t("dashboard_workspace_transfer_owner")}
            cancelLabel={t("dashboard_cancel")}
            workspaceId={workspaceCrud.transferWorkspaceId}
            ownerUserId={workspaceCrud.transferOwnerUserId}
            ownerOptions={ownerOptions}
            isSubmitting={workspaceCrud.isWorkspaceSubmitting}
            isOpen={workspaceCrud.isWorkspaceTransferDialogOpen}
            onClose={workspaceCrud.closeTransferOwnerDialog}
            onOwnerUserIdChange={workspaceCrud.setTransferOwnerUserId}
            onSubmit={workspaceCrud.submitTransferOwner}
          />

          <WorkspaceDeleteDialog
            title={t("dashboard_workspace_delete_confirm_title")}
            description={t("dashboard_workspace_delete_confirm_description")}
            cancelLabel={t("dashboard_cancel")}
            confirmLabel={t("dashboard_delete")}
            isSubmitting={workspaceCrud.isWorkspaceSubmitting}
            isOpen={workspaceCrud.pendingDeleteWorkspaceId !== null}
            onClose={workspaceCrud.cancelDeleteWorkspace}
            onConfirm={workspaceCrud.confirmDeleteWorkspace}
          />
        </>
      }
    />
  );
}
