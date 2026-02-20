import DashboardMembersSection from "@/features/dashboard/components/DashboardMembersSection";
import DashboardWorkspaceInvitationsSection from "@/features/dashboard/components/DashboardWorkspaceInvitationsSection";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";
import { cn } from "@/lib/utils";

type DashboardMembersTabSectionProps = Pick<
  DashboardPageViewProps,
  | "model"
  | "workspaceManagement"
  | "canManageMembers"
  | "memberDraftUserId"
  | "memberDraftRole"
  | "memberInviteRole"
  | "memberEditingUserId"
  | "memberEditingRole"
  | "memberInvitationUrl"
  | "pendingDeleteMemberUserId"
  | "isMemberSubmitting"
  | "isMembersLoading"
  | "isMembersError"
  | "isMemberAddDialogOpen"
  | "isMemberInviteDialogOpen"
  | "isMemberRoleDialogOpen"
  | "onOpenMemberAddDialog"
  | "onCloseMemberAddDialog"
  | "onOpenMemberInviteDialog"
  | "onCloseMemberInviteDialog"
  | "onMemberDraftUserIdChange"
  | "onMemberDraftRoleChange"
  | "onMemberInviteRoleChange"
  | "onMemberEditingRoleChange"
  | "onMemberSubmitAdd"
  | "onMemberGenerateInvite"
  | "onMemberCopyInviteLink"
  | "onMemberRequestEdit"
  | "onMemberCloseEditDialog"
  | "onMemberSubmitRoleUpdate"
  | "onMemberRequestDelete"
  | "onMemberCancelDelete"
  | "onMemberConfirmDelete"
>;

export default function DashboardMembersTabSection(props: DashboardMembersTabSectionProps) {
  const { model, workspaceManagement } = props;
  const activeWorkspaceName =
    model.filters.workspaceOptions.find((workspace) => workspace.id === model.filters.workspaceId)?.name ?? "-";

  return (
    <section className={cn("grid gap-4 xl:grid-cols-2")}>
      <DashboardMembersSection
        title={model.texts.members}
        userIdLabel={model.texts.memberUserId}
        usernameLabel={model.texts.memberUsername}
        roleLabel={model.texts.memberRole}
        invitationLinkLabel={model.texts.invitationLink}
        invitationLinkPlaceholder={model.texts.invitationLinkPlaceholder}
        generateInviteLabel={model.texts.generateInvite}
        copyLinkLabel={model.texts.copyLink}
        addLabel={model.texts.add}
        editLabel={model.texts.edit}
        updateLabel={model.texts.edit}
        cancelLabel={model.texts.cancel}
        deleteLabel={model.texts.delete}
        emptyLabel={model.texts.membersEmpty}
        errorLabel={model.texts.membersError}
        noPermissionLabel={model.texts.noPermission}
        canManage={props.canManageMembers}
        deleteConfirmTitle={model.texts.memberDeleteConfirmTitle}
        deleteConfirmDescription={model.texts.memberDeleteConfirmDescription}
        members={model.members}
        roleOptions={[
          { id: "owner", name: "owner" },
          { id: "editor", name: "editor" },
          { id: "viewer", name: "viewer" },
        ]}
        draftUserId={props.memberDraftUserId}
        draftRole={props.memberDraftRole}
        inviteRole={props.memberInviteRole}
        editingUserId={props.memberEditingUserId}
        editingRole={props.memberEditingRole}
        invitationUrl={props.memberInvitationUrl}
        isLoading={props.isMembersLoading}
        isError={props.isMembersError}
        isSubmitting={props.isMemberSubmitting}
        isAddDialogOpen={props.isMemberAddDialogOpen}
        isInviteDialogOpen={props.isMemberInviteDialogOpen}
        isEditDialogOpen={props.isMemberRoleDialogOpen}
        pendingDeleteUserId={props.pendingDeleteMemberUserId}
        onOpenAddDialog={props.onOpenMemberAddDialog}
        onCloseAddDialog={props.onCloseMemberAddDialog}
        onOpenInviteDialog={props.onOpenMemberInviteDialog}
        onCloseInviteDialog={props.onCloseMemberInviteDialog}
        onDraftUserIdChange={props.onMemberDraftUserIdChange}
        onDraftRoleChange={props.onMemberDraftRoleChange}
        onInviteRoleChange={props.onMemberInviteRoleChange}
        onEditingRoleChange={props.onMemberEditingRoleChange}
        onSubmitAdd={props.onMemberSubmitAdd}
        onGenerateInvite={props.onMemberGenerateInvite}
        onCopyInvitationLink={props.onMemberCopyInviteLink}
        onRequestEdit={props.onMemberRequestEdit}
        onCloseEditDialog={props.onMemberCloseEditDialog}
        onSubmitRoleUpdate={props.onMemberSubmitRoleUpdate}
        onRequestDelete={props.onMemberRequestDelete}
        onCancelDelete={props.onMemberCancelDelete}
        onConfirmDelete={props.onMemberConfirmDelete}
      />
      <DashboardWorkspaceInvitationsSection
        title={model.texts.invitations}
        workspaceLabel={model.texts.workspaceName}
        workspaceName={activeWorkspaceName}
        roleLabel={model.texts.invitationRole}
        createdByLabel={model.texts.invitationCreatedBy}
        expiresAtLabel={model.texts.invitationExpiresAt}
        usedAtLabel={model.texts.invitationUsedAt}
        statusActiveLabel={model.texts.invitationStatusActive}
        statusUsedLabel={model.texts.invitationStatusUsed}
        statusExpiredLabel={model.texts.invitationStatusExpired}
        revokeConfirmTitle={model.texts.invitationRevokeConfirmTitle}
        revokeConfirmDescription={model.texts.invitationRevokeConfirmDescription}
        revokeLabel={model.texts.delete}
        cancelLabel={model.texts.cancel}
        emptyLabel={model.texts.invitationsEmpty}
        errorLabel={model.texts.invitationsError}
        canManage={workspaceManagement.canManageWorkspace}
        noPermissionLabel={model.texts.noPermission}
        invitations={workspaceManagement.invitations}
        isLoading={workspaceManagement.isInvitationsLoading}
        isError={workspaceManagement.isInvitationsError}
        isForbidden={workspaceManagement.isInvitationsForbidden}
        isSubmitting={workspaceManagement.isWorkspaceSubmitting}
        pendingRevokeInvitationId={workspaceManagement.pendingRevokeInvitationId}
        onRequestRevoke={workspaceManagement.onRequestRevokeInvitation}
        onCancelRevoke={workspaceManagement.onCancelRevokeInvitation}
        onConfirmRevoke={workspaceManagement.onConfirmRevokeInvitation}
      />
    </section>
  );
}
