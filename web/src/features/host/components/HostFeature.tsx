import { useAuth } from "react-oidc-context";
import { useHostQueries } from "@/features/host/api/useHostQueries";
import { HostCreateButton } from "@/features/host/components/HostCreateButton/HostCreateButton";
import { HostDeleteDialog } from "@/features/host/components/HostDeleteDialog/HostDeleteDialog";
import { HostFormDialog } from "@/features/host/components/HostFormDialog/HostFormDialog";
import { HostList } from "@/features/host/components/HostList/HostList";
import { HostSection } from "@/features/host/components/HostSection/HostSection";
import { HostTokenDialog } from "@/features/host/components/HostTokenDialog/HostTokenDialog";
import { useHostCrud } from "@/features/host/hooks/useHostCrud";
import { useHostPermissions } from "@/features/host/hooks/useHostPermissions";
import { useHostViewModel } from "@/features/host/hooks/useHostViewModel";
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

  const { canManage } = useHostPermissions({
    currentUser,
    members: membersQuery.data?.members,
  });
  const { hosts, workspaceName, viewState } = useHostViewModel({
    workspaceId,
    hosts: hostsQuery.data,
    workspaces: workspacesQuery.data?.workspaces,
    isLoading: hostsQuery.isLoading,
    isError: hostsQuery.isError,
  });
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
