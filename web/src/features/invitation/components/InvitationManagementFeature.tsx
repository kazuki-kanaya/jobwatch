import { useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useInvitationQueries } from "@/features/invitation/api/useInvitationQueries";
import { InvitationCreateDialog } from "@/features/invitation/components/InvitationCreateDialog/InvitationCreateDialog";
import { InvitationList } from "@/features/invitation/components/InvitationList/InvitationList";
import { InvitationManagementSection } from "@/features/invitation/components/InvitationManagementSection/InvitationManagementSection";
import { InvitationRevokeDialog } from "@/features/invitation/components/InvitationRevokeDialog/InvitationRevokeDialog";
import { useInvitationCrud } from "@/features/invitation/hooks/useInvitationCrud";
import { useInvitationViewModel } from "@/features/invitation/hooks/useInvitationViewModel";
import { useMemberPermissions, useMemberQueries } from "@/features/member";
import type { CurrentUser } from "@/features/user";
import { MembershipRole } from "@/generated/api";
import { useLocale } from "@/i18n/LocaleProvider";
import { useDisplaySettings } from "@/providers/DisplaySettingsProvider";

type InvitationManagementFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
  createDialogRequestKey: number;
};

const roleOptions = [
  { id: MembershipRole.owner, name: "OWNER" },
  { id: MembershipRole.editor, name: "EDITOR" },
  { id: MembershipRole.viewer, name: "VIEWER" },
] as const;

export function InvitationManagementFeature({
  workspaceId,
  currentUser,
  createDialogRequestKey,
}: InvitationManagementFeatureProps) {
  const lastHandledRequestKeyRef = useRef(0);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const { formatDateTime } = useDisplaySettings();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  const { membersQuery } = useMemberQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });
  const { canManage } = useMemberPermissions({
    currentUser,
    members: membersQuery.data?.members,
  });
  const isPermissionLoading = membersQuery.isLoading;
  const isForbidden = Boolean(workspaceId) && !isPermissionLoading && !canManage;
  const canAccessInvitations = canAccessFeature && canManage;

  const { invitationsQuery, usersLookupQuery } = useInvitationQueries({
    accessToken,
    enabled: canAccessInvitations,
    workspaceId,
  });
  const { items, viewState } = useInvitationViewModel({
    invitations: invitationsQuery.data?.invitations,
    users: usersLookupQuery.data?.users,
    isLoading: invitationsQuery.isLoading || usersLookupQuery.isLoading || isPermissionLoading,
    isError: invitationsQuery.isError || usersLookupQuery.isError,
    formatDateTime,
  });

  const invitationCrud = useInvitationCrud({
    accessToken,
    workspaceId,
    texts: {
      invitationLinkCreated: t("dashboard_invitation_link_created"),
      invitationLinkCopied: t("dashboard_invitation_link_copied"),
      invitationCrudError: t("dashboard_invitation_crud_error"),
      invitationRevoked: t("dashboard_invitation_revoked"),
    },
  });

  useEffect(() => {
    if (!createDialogRequestKey) return;
    if (!canManage) return;
    if (createDialogRequestKey <= lastHandledRequestKeyRef.current) return;
    lastHandledRequestKeyRef.current = createDialogRequestKey;
    invitationCrud.openCreateDialog();
  }, [canManage, createDialogRequestKey, invitationCrud]);

  const emptyLabel = workspaceId && canManage ? t("dashboard_invitations_empty") : t("dashboard_workspaces_empty");

  return (
    <InvitationManagementSection
      title={t("dashboard_invitations")}
      list={
        <InvitationList
          items={items}
          isLoading={viewState === "loading"}
          isError={viewState === "error"}
          isForbidden={isForbidden}
          emptyLabel={emptyLabel}
          forbiddenLabel={t("dashboard_no_permission")}
          errorLabel={t("dashboard_invitations_error")}
          canManage={canManage}
          labels={{
            createdBy: t("dashboard_invitation_created_by"),
            expiresAt: t("dashboard_invitation_expires_at"),
            active: t("dashboard_invitation_status_active"),
            used: t("dashboard_invitation_status_used"),
            expired: t("dashboard_invitation_status_expired"),
            revoke: t("dashboard_delete"),
          }}
          onRevoke={invitationCrud.requestRevoke}
        />
      }
      dialogs={
        <>
          <InvitationCreateDialog
            title={t("dashboard_generate_invite")}
            description={workspaceId || "-"}
            roleLabel={t("dashboard_invitation_role")}
            generateLabel={t("dashboard_generate_invite")}
            invitationLinkLabel={t("dashboard_invitation_link")}
            invitationLinkPlaceholder={t("dashboard_invitation_link_placeholder")}
            copyLabel={t("dashboard_copy_link")}
            cancelLabel={t("dashboard_cancel")}
            draftRole={invitationCrud.draftRole}
            roleOptions={roleOptions}
            invitationUrl={invitationCrud.createdInvitationUrl}
            isSubmitting={invitationCrud.isSubmitting}
            isOpen={invitationCrud.isCreateDialogOpen}
            onClose={invitationCrud.closeCreateDialog}
            onDraftRoleChange={invitationCrud.setDraftRole}
            onGenerate={invitationCrud.submitCreateInvitation}
            onCopy={invitationCrud.copyCreatedInvitationUrl}
          />
          <InvitationRevokeDialog
            title={t("dashboard_invitation_revoke_confirm_title")}
            description={t("dashboard_invitation_revoke_confirm_description")}
            cancelLabel={t("dashboard_cancel")}
            confirmLabel={t("dashboard_delete")}
            isSubmitting={invitationCrud.isSubmitting}
            isOpen={invitationCrud.pendingRevokeInvitationId !== null}
            onClose={invitationCrud.cancelRevoke}
            onConfirm={invitationCrud.confirmRevoke}
          />
        </>
      }
    />
  );
}
