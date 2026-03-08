import { useAuth } from "react-oidc-context";
import { useMemberQueries } from "@/features/member/api/useMemberQueries";
import { MemberAddDialog } from "@/features/member/components/MemberAddDialog/MemberAddDialog";
import { MemberCreateButton } from "@/features/member/components/MemberCreateButton/MemberCreateButton";
import { MemberDeleteDialog } from "@/features/member/components/MemberDeleteDialog/MemberDeleteDialog";
import { MemberList } from "@/features/member/components/MemberList/MemberList";
import { MemberRoleDialog } from "@/features/member/components/MemberRoleDialog/MemberRoleDialog";
import { MemberSection } from "@/features/member/components/MemberSection/MemberSection";
import { useMemberCrud } from "@/features/member/hooks/useMemberCrud";
import { useMemberPermissions } from "@/features/member/hooks/useMemberPermissions";
import { useMemberViewModel } from "@/features/member/hooks/useMemberViewModel";
import type { CurrentUser } from "@/features/user";
import { MembershipRole } from "@/generated/api";
import { useLocale } from "@/i18n/LocaleProvider";

type MemberFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
};

const roleOptions = [
  { id: MembershipRole.owner, name: "OWNER" },
  { id: MembershipRole.editor, name: "EDITOR" },
  { id: MembershipRole.viewer, name: "VIEWER" },
] as const;

export function MemberFeature({ workspaceId, currentUser }: MemberFeatureProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  const { membersQuery, usersLookupQuery } = useMemberQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const { canManage } = useMemberPermissions({
    currentUser,
    members: membersQuery.data?.members,
  });

  const { items, viewState } = useMemberViewModel({
    members: membersQuery.data?.members,
    users: usersLookupQuery.data?.users,
    isLoading: membersQuery.isLoading || usersLookupQuery.isLoading,
    isError: membersQuery.isError || usersLookupQuery.isError,
  });

  const memberCrud = useMemberCrud({
    accessToken,
    workspaceId,
    texts: {
      memberAdded: t("dashboard_member_added"),
      memberUpdated: t("dashboard_member_updated"),
      memberRemoved: t("dashboard_member_removed"),
      memberCrudError: t("dashboard_member_crud_error"),
    },
  });

  return (
    <MemberSection
      title={t("dashboard_members")}
      headerActions={
        <MemberCreateButton
          addLabel={t("dashboard_add")}
          noPermissionLabel={t("dashboard_no_permission")}
          canCreate={canManage && Boolean(workspaceId)}
          onCreateMember={memberCrud.openAddDialog}
        />
      }
      content={
        <MemberList
          items={items}
          isLoading={viewState === "loading"}
          isError={viewState === "error"}
          emptyLabel={workspaceId ? t("dashboard_members_empty") : t("dashboard_workspaces_empty")}
          errorLabel={t("dashboard_members_error")}
          userIdLabel={t("dashboard_member_user_id")}
          roleLabel={t("dashboard_member_role")}
          editLabel={t("dashboard_edit")}
          deleteLabel={t("dashboard_delete")}
          canManage={canManage}
          onEditMember={(userId) => {
            const member = items.find((item) => item.userId === userId);
            if (!member) return;
            memberCrud.openRoleDialog(userId, member.role);
          }}
          onDeleteMember={memberCrud.requestDelete}
        />
      }
      dialogs={
        <>
          <MemberAddDialog
            title={t("dashboard_add")}
            description={workspaceId || "-"}
            userIdLabel={t("dashboard_member_user_id")}
            roleLabel={t("dashboard_member_role")}
            addLabel={t("dashboard_add")}
            cancelLabel={t("dashboard_cancel")}
            draftUserId={memberCrud.draftUserId}
            draftRole={memberCrud.draftRole}
            roleOptions={roleOptions}
            isSubmitting={memberCrud.isSubmitting}
            isOpen={memberCrud.isAddDialogOpen}
            onClose={memberCrud.closeAddDialog}
            onDraftUserIdChange={memberCrud.setDraftUserId}
            onDraftRoleChange={memberCrud.setDraftRole}
            onSubmit={memberCrud.submitAddMember}
          />

          <MemberRoleDialog
            title={t("dashboard_edit")}
            description={workspaceId || "-"}
            userIdLabel={t("dashboard_member_user_id")}
            roleLabel={t("dashboard_member_role")}
            updateLabel={t("dashboard_update")}
            cancelLabel={t("dashboard_cancel")}
            editingUserId={memberCrud.editingUserId}
            editingRole={memberCrud.editingRole}
            roleOptions={roleOptions}
            isSubmitting={memberCrud.isSubmitting}
            isOpen={memberCrud.isRoleDialogOpen}
            onClose={memberCrud.closeRoleDialog}
            onEditingRoleChange={memberCrud.setEditingRole}
            onSubmit={memberCrud.submitUpdateRole}
          />

          <MemberDeleteDialog
            title={t("dashboard_member_delete_confirm_title")}
            description={t("dashboard_member_delete_confirm_description")}
            cancelLabel={t("dashboard_cancel")}
            confirmLabel={t("dashboard_delete")}
            isSubmitting={memberCrud.isSubmitting}
            isOpen={memberCrud.pendingDeleteUserId !== null}
            onClose={memberCrud.cancelDelete}
            onConfirm={memberCrud.confirmDelete}
          />
        </>
      }
    />
  );
}
