import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useHostQueries } from "@/features/host/api/useHostQueries";
import { HostSection } from "@/features/host/components/HostSection/HostSection";
import type { HostViewState } from "@/features/host/components/types";
import { useHostCrud } from "@/features/host/hooks/useHostCrud";
import type { CurrentUser } from "@/features/user";
import { useWorkspaceQueries } from "@/features/workspace/api/useWorkspaceQueries";
import { useLocale } from "@/i18n/LocaleProvider";

type HostFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
};

export function HostFeature({ workspaceId, currentUser }: HostFeatureProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  const { workspacesQuery, membersQuery } = useWorkspaceQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });
  const { hostsQuery } = useHostQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const currentMembershipRole =
    currentUser?.id && membersQuery.data?.members
      ? (membersQuery.data.members.find((member) => member.user_id === currentUser.id)?.role ?? null)
      : null;
  const canManage = currentMembershipRole === "owner" || currentMembershipRole === "editor";

  const hosts = useMemo(() => {
    const items = hostsQuery.data ?? [];
    return items.map((host) => ({
      id: host.host_id,
      name: host.name,
    }));
  }, [hostsQuery.data]);

  const workspaceName = useMemo(() => {
    const workspaces = workspacesQuery.data?.workspaces ?? [];
    return workspaces.find((workspace) => workspace.workspace_id === workspaceId)?.name ?? "";
  }, [workspaceId, workspacesQuery.data]);

  const viewState: HostViewState = hostsQuery.isLoading
    ? "loading"
    : hostsQuery.isError
      ? "error"
      : hosts.length === 0
        ? "empty"
        : "ready";

  const hostCrud = useHostCrud({
    accessToken,
    workspaceId,
    hosts,
    texts: {
      hostCreated: t("dashboard_host_created"),
      hostUpdated: t("dashboard_host_updated"),
      hostDeleted: t("dashboard_host_deleted"),
      hostCrudError: t("dashboard_host_crud_error"),
      hostTokenCopied: t("dashboard_host_token_copied"),
      hostTokenCopyError: t("dashboard_host_token_copy_error"),
    },
  });

  return (
    <HostSection
      title={t("dashboard_hosts")}
      emptyLabel={workspaceId ? t("dashboard_hosts_empty") : t("dashboard_workspaces_empty")}
      errorLabel={t("dashboard_hosts_error")}
      state={viewState}
      hosts={hosts}
      canCreate={canManage}
      canManage={canManage}
      noPermissionLabel={t("dashboard_no_permission")}
      addLabel={t("dashboard_add")}
      editLabel={t("dashboard_edit")}
      deleteLabel={t("dashboard_delete")}
      hostNameLabel={t("dashboard_host_name")}
      createLabel={t("dashboard_add")}
      updateLabel={t("dashboard_edit")}
      formTitle={hostCrud.editingHostId ? t("dashboard_edit") : t("dashboard_add")}
      formDescription={workspaceName}
      deleteDialogTitle={t("dashboard_host_delete_confirm_title")}
      deleteDialogDescription={t("dashboard_host_delete_confirm_description")}
      tokenDialogTitle={t("dashboard_host_token")}
      tokenDialogDescription={workspaceName}
      tokenLabel={t("dashboard_host_token")}
      tokenCopyLabel={t("dashboard_copy_token")}
      closeLabel={t("dashboard_cancel")}
      cancelLabel={t("dashboard_cancel")}
      isSubmitting={hostCrud.isHostSubmitting}
      isFormOpen={hostCrud.isHostFormOpen}
      isDeleteDialogOpen={hostCrud.pendingDeleteHostId !== null}
      hostDraftName={hostCrud.hostDraftName}
      isEditing={hostCrud.editingHostId !== null}
      hostToken={hostCrud.hostToken}
      hostTokenMessage={hostCrud.hostTokenMessage}
      onCreateHost={hostCrud.openCreateHostForm}
      onEditHost={hostCrud.startEditHost}
      onDeleteHost={hostCrud.requestDeleteHost}
      onHostDraftNameChange={hostCrud.setHostDraftName}
      onSubmitHost={hostCrud.submitHost}
      onSubmitDeleteHost={hostCrud.confirmDeleteHost}
      onCloseHostForm={hostCrud.closeHostForm}
      onCloseDeleteDialog={hostCrud.cancelDeleteHost}
      onCopyHostToken={hostCrud.copyHostToken}
      onCloseHostTokenDialog={hostCrud.dismissHostToken}
    />
  );
}
