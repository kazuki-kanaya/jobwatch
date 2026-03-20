import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useMemberQueries } from "@/features/member";
import type { CurrentUser } from "@/features/user";
import { useWorkspaceQueries } from "@/features/workspace/api/useWorkspaceQueries";
import { WorkspaceCreateButton } from "@/features/workspace/components/WorkspaceCreateButton/WorkspaceCreateButton";
import { WorkspaceDeleteDialog } from "@/features/workspace/components/WorkspaceDeleteDialog/WorkspaceDeleteDialog";
import { WorkspaceFormDialog } from "@/features/workspace/components/WorkspaceFormDialog/WorkspaceFormDialog";
import { WorkspaceList } from "@/features/workspace/components/WorkspaceList/WorkspaceList";
import { WorkspaceSection } from "@/features/workspace/components/WorkspaceSection/WorkspaceSection";
import { WorkspaceTransferDialog } from "@/features/workspace/components/WorkspaceTransferDialog/WorkspaceTransferDialog";
import { useWorkspaceAutoSelect } from "@/features/workspace/hooks/useWorkspaceAutoSelect";
import { useWorkspaceCrud } from "@/features/workspace/hooks/useWorkspaceCrud";
import { useWorkspacePermissions } from "@/features/workspace/hooks/useWorkspacePermissions";
import { useWorkspaceViewModel } from "@/features/workspace/hooks/useWorkspaceViewModel";
import { useLocale } from "@/i18n/LocaleProvider";

type WorkspaceFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
  onWorkspaceChange: (workspace: { workspaceId: string; workspaceName: string }) => void;
};

export function WorkspaceFeature({ workspaceId, currentUser, onWorkspaceChange }: WorkspaceFeatureProps) {
  const onWorkspaceChangeRef = useRef(onWorkspaceChange);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canCreate = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  useEffect(() => {
    onWorkspaceChangeRef.current = onWorkspaceChange;
  }, [onWorkspaceChange]);

  const { workspacesQuery } = useWorkspaceQueries({
    accessToken,
    enabled: canCreate,
  });
  const { membersQuery, usersLookupQuery } = useMemberQueries({
    accessToken,
    enabled: canCreate,
    workspaceId,
  });

  const { workspaces, activeWorkspaceId, selectedWorkspaceName, ownerOptions, viewState } = useWorkspaceViewModel({
    workspaceId,
    workspaces: workspacesQuery.data?.workspaces,
    members: membersQuery.data?.members,
    users: usersLookupQuery.data?.users,
    isLoading: workspacesQuery.isLoading,
    isError: workspacesQuery.isError,
  });
  const { canManage } = useWorkspacePermissions({
    currentUser,
    members: membersQuery.data?.members,
  });

  const workspaceNameById = useMemo(() => new Map(workspaces.map((item) => [item.id, item.name])), [workspaces]);

  const emitWorkspaceChange = useCallback(
    (nextWorkspaceId: string) => {
      onWorkspaceChangeRef.current({
        workspaceId: nextWorkspaceId,
        workspaceName: workspaceNameById.get(nextWorkspaceId) ?? "-",
      });
    },
    [workspaceNameById],
  );

  useWorkspaceAutoSelect({
    workspaceId,
    workspaces,
    onWorkspaceIdChange: emitWorkspaceChange,
  });

  useEffect(() => {
    onWorkspaceChangeRef.current({
      workspaceId: activeWorkspaceId || "-",
      workspaceName: selectedWorkspaceName,
    });
  }, [activeWorkspaceId, selectedWorkspaceName]);

  const isLoading = viewState === "loading";
  const isError = viewState === "error";

  const workspaceCrud = useWorkspaceCrud({
    accessToken,
    workspaceId: activeWorkspaceId,
    workspaces,
    onWorkspaceIdChange: emitWorkspaceChange,
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
          onSelectWorkspace={emitWorkspaceChange}
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
