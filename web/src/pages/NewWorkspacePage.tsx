import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useWorkspaceQueries } from "@/features/workspace/api/useWorkspaceQueries";
import type { WorkspaceViewState } from "@/features/workspace/components/types";
import { WorkspaceSection } from "@/features/workspace/components/WorkspaceSection/WorkspaceSection";
import { useWorkspaceCrud } from "@/features/workspace/hooks/useWorkspaceCrud";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export default function NewWorkspacePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canCreate = isAuthenticated && !isAuthLoading && Boolean(accessToken);
  const [workspaceId, setWorkspaceId] = useState("");

  const { currentUserQuery, workspacesQuery, membersQuery, usersLookupQuery } = useWorkspaceQueries({
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
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaceId, workspaces]);

  const activeWorkspace = workspaces.find((workspace) => workspace.id === workspaceId) ?? workspaces[0];
  const activeWorkspaceId = activeWorkspace?.id ?? "";
  const selectedWorkspaceName = activeWorkspace?.name ?? "-";

  const userNameById = useMemo(() => {
    const users = usersLookupQuery.data?.users ?? [];
    return new Map(users.map((user) => [user.user_id, user.name]));
  }, [usersLookupQuery.data]);

  const ownerOptions = useMemo(() => {
    const members = membersQuery.data?.members ?? [];
    return members.map((member) => ({
      id: member.user_id,
      name: userNameById.get(member.user_id)
        ? `${userNameById.get(member.user_id)} (${member.user_id})`
        : member.user_id,
    }));
  }, [membersQuery.data, userNameById]);

  const currentMembershipRole =
    currentUserQuery.data?.user_id && membersQuery.data?.members
      ? (membersQuery.data.members.find((member) => member.user_id === currentUserQuery.data?.user_id)?.role ?? null)
      : null;
  const canManage = currentMembershipRole === "owner";

  const viewState: WorkspaceViewState = workspacesQuery.isLoading
    ? "loading"
    : workspacesQuery.isError
      ? "error"
      : workspaces.length === 0
        ? "empty"
        : "ready";

  const workspaceCrud = useWorkspaceCrud({
    accessToken,
    workspaceId: activeWorkspaceId,
    workspaces,
    onWorkspaceChange: setWorkspaceId,
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
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.12),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.08),transparent_28%),#030712] px-4 py-6 md:px-8",
      )}
    >
      <div className={cn("mx-auto w-full max-w-7xl")}>
        <WorkspaceSection
          title={t("dashboard_workspaces")}
          summaryLabel={t("dashboard_current_workspace")}
          summaryHint={t("dashboard_workspace_scope_hint")}
          emptyLabel={t("dashboard_workspaces_empty")}
          errorLabel={t("dashboard_workspaces_error")}
          state={viewState}
          activeWorkspaceId={activeWorkspaceId}
          selectedWorkspaceName={selectedWorkspaceName}
          workspaces={workspaces}
          ownerOptions={ownerOptions}
          canCreate={canCreate}
          canManage={canManage}
          noPermissionLabel={t("dashboard_no_permission")}
          editLabel={t("dashboard_edit")}
          addLabel={t("dashboard_add")}
          deleteLabel={t("dashboard_delete")}
          transferOwnerLabel={t("dashboard_workspace_transfer_owner")}
          formTitle={workspaceCrud.editingWorkspaceId ? t("dashboard_edit") : t("dashboard_add")}
          formDescription={t("dashboard_workspace_scope_hint")}
          workspaceNameLabel={t("dashboard_workspace_name")}
          createLabel={t("dashboard_add")}
          updateLabel={t("dashboard_edit")}
          transferDialogTitle={t("dashboard_workspace_transfer_owner")}
          transferDialogDescription={t("dashboard_workspace_scope_hint")}
          ownerUserIdLabel={t("dashboard_workspace_new_owner_user_id")}
          deleteDialogTitle={t("dashboard_workspace_delete_confirm_title")}
          deleteDialogDescription={t("dashboard_workspace_delete_confirm_description")}
          cancelLabel={t("dashboard_cancel")}
          isSubmitting={workspaceCrud.isWorkspaceSubmitting}
          isFormOpen={workspaceCrud.isWorkspaceFormOpen}
          isDeleteDialogOpen={workspaceCrud.pendingDeleteWorkspaceId !== null}
          isTransferDialogOpen={workspaceCrud.isWorkspaceTransferDialogOpen}
          isEditing={workspaceCrud.editingWorkspaceId !== null}
          transferWorkspaceId={workspaceCrud.transferWorkspaceId}
          workspaceDraftName={workspaceCrud.workspaceDraftName}
          transferOwnerUserId={workspaceCrud.transferOwnerUserId}
          onSelectWorkspace={setWorkspaceId}
          onCreateWorkspace={workspaceCrud.openWorkspaceCreateForm}
          onEditWorkspace={workspaceCrud.startEditWorkspace}
          onDeleteWorkspace={workspaceCrud.requestDeleteWorkspace}
          onTransferWorkspaceOwner={workspaceCrud.openTransferOwnerDialog}
          onWorkspaceDraftNameChange={workspaceCrud.setWorkspaceDraftName}
          onTransferOwnerUserIdChange={workspaceCrud.setTransferOwnerUserId}
          onSubmitWorkspace={workspaceCrud.submitWorkspace}
          onSubmitDeleteWorkspace={workspaceCrud.confirmDeleteWorkspace}
          onSubmitTransferWorkspaceOwner={workspaceCrud.submitTransferOwner}
          onCloseWorkspaceForm={workspaceCrud.closeWorkspaceForm}
          onCloseDeleteDialog={workspaceCrud.cancelDeleteWorkspace}
          onCloseTransferDialog={workspaceCrud.closeTransferOwnerDialog}
        />
      </div>
    </main>
  );
}
