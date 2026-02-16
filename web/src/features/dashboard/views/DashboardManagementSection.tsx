import DashboardHostsSection from "@/features/dashboard/components/DashboardHostsSection";
import DashboardMembersSection from "@/features/dashboard/components/DashboardMembersSection";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";
import { cn } from "@/lib/utils";

type DashboardManagementSectionProps = Pick<
  DashboardPageViewProps,
  | "model"
  | "canManageHosts"
  | "canManageMembers"
  | "hostDraftName"
  | "editingHostId"
  | "hostToken"
  | "hostTokenMessage"
  | "isHostSubmitting"
  | "isHostsLoading"
  | "isHostsError"
  | "isHostFormOpen"
  | "pendingDeleteHostId"
  | "onOpenHostCreate"
  | "onHostDraftChange"
  | "onHostSubmit"
  | "onHostCopyToken"
  | "onHostStartEdit"
  | "onHostCloseForm"
  | "onHostRequestDelete"
  | "onHostCancelDelete"
  | "onHostConfirmDelete"
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

export default function DashboardManagementSection(props: DashboardManagementSectionProps) {
  const { model } = props;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-2")}>
      <DashboardHostsSection
        title={model.texts.hosts}
        hostNameLabel={model.texts.hostName}
        addLabel={model.texts.add}
        updateLabel={model.texts.update}
        cancelLabel={model.texts.cancel}
        deleteLabel={model.texts.delete}
        emptyLabel={model.texts.hostsEmpty}
        errorLabel={model.texts.hostsError}
        noPermissionLabel={model.texts.noPermission}
        canManage={props.canManageHosts}
        tokenLabel={model.texts.hostToken}
        tokenCopyLabel={model.texts.copyToken}
        tokenValue={props.hostToken}
        tokenMessage={props.hostTokenMessage}
        deleteConfirmTitle={model.texts.hostDeleteConfirmTitle}
        deleteConfirmDescription={model.texts.hostDeleteConfirmDescription}
        draftName={props.hostDraftName}
        editingHostId={props.editingHostId}
        hosts={model.hosts}
        isLoading={props.isHostsLoading}
        isError={props.isHostsError}
        isSubmitting={props.isHostSubmitting}
        isFormOpen={props.isHostFormOpen}
        pendingDeleteHostId={props.pendingDeleteHostId}
        onOpenCreate={props.onOpenHostCreate}
        onDraftNameChange={props.onHostDraftChange}
        onSubmit={props.onHostSubmit}
        onCopyToken={props.onHostCopyToken}
        onStartEdit={props.onHostStartEdit}
        onCloseForm={props.onHostCloseForm}
        onRequestDelete={props.onHostRequestDelete}
        onCancelDelete={props.onHostCancelDelete}
        onConfirmDelete={props.onHostConfirmDelete}
      />
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
        updateLabel={model.texts.update}
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
    </div>
  );
}
