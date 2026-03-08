import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useHostQueries } from "@/features/host/api/useHostQueries";
import { HostCreateButton } from "@/features/host/components/HostCreateButton/HostCreateButton";
import { HostDeleteDialog } from "@/features/host/components/HostDeleteDialog/HostDeleteDialog";
import { HostFormDialog } from "@/features/host/components/HostFormDialog/HostFormDialog";
import { HostList } from "@/features/host/components/HostList/HostList";
import { HostSection } from "@/features/host/components/HostSection/HostSection";
import { HostTokenDialog } from "@/features/host/components/HostTokenDialog/HostTokenDialog";
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
  const isLoading = viewState === "loading";
  const isError = viewState === "error";

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
      headerActions={
        <HostCreateButton
          addLabel={t("dashboard_add")}
          noPermissionLabel={t("dashboard_no_permission")}
          canCreate={canManage}
          onCreateHost={hostCrud.openCreateHostForm}
        />
      }
      content={
        <HostList
          items={hosts}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={workspaceId ? t("dashboard_hosts_empty") : t("dashboard_workspaces_empty")}
          errorLabel={t("dashboard_hosts_error")}
          editLabel={t("dashboard_edit")}
          deleteLabel={t("dashboard_delete")}
          canManage={canManage}
          onEditHost={hostCrud.startEditHost}
          onDeleteHost={hostCrud.requestDeleteHost}
        />
      }
      dialogs={
        <>
          <HostFormDialog
            title={hostCrud.editingHostId ? t("dashboard_edit") : t("dashboard_add")}
            description={workspaceName}
            hostNameLabel={t("dashboard_host_name")}
            createLabel={t("dashboard_add")}
            updateLabel={t("dashboard_edit")}
            cancelLabel={t("dashboard_cancel")}
            hostDraftName={hostCrud.hostDraftName}
            isEditing={hostCrud.editingHostId !== null}
            isSubmitting={hostCrud.isHostSubmitting}
            isOpen={hostCrud.isHostFormOpen}
            onClose={hostCrud.closeHostForm}
            onHostDraftNameChange={hostCrud.setHostDraftName}
            onSubmit={hostCrud.submitHost}
          />

          <HostDeleteDialog
            title={t("dashboard_host_delete_confirm_title")}
            description={t("dashboard_host_delete_confirm_description")}
            cancelLabel={t("dashboard_cancel")}
            confirmLabel={t("dashboard_delete")}
            isSubmitting={hostCrud.isHostSubmitting}
            isOpen={hostCrud.pendingDeleteHostId !== null}
            onClose={hostCrud.cancelDeleteHost}
            onConfirm={hostCrud.confirmDeleteHost}
          />

          <HostTokenDialog
            title={t("dashboard_host_token")}
            description={workspaceName}
            tokenLabel={t("dashboard_host_token")}
            copyLabel={t("dashboard_copy_token")}
            closeLabel={t("dashboard_cancel")}
            token={hostCrud.hostToken}
            tokenMessage={hostCrud.hostTokenMessage}
            isOpen={Boolean(hostCrud.hostToken)}
            onCopy={hostCrud.copyHostToken}
            onClose={hostCrud.dismissHostToken}
          />
        </>
      }
    />
  );
}
