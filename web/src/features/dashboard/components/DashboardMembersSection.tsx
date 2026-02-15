// Responsibility: Compose member list and dialogs for add/remove/invitation actions.
import { Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardMemberAddDialog from "@/features/dashboard/components/DashboardMemberAddDialog";
import DashboardMemberDeleteDialog from "@/features/dashboard/components/DashboardMemberDeleteDialog";
import DashboardMemberInviteDialog from "@/features/dashboard/components/DashboardMemberInviteDialog";
import DashboardMemberList from "@/features/dashboard/components/DashboardMemberList";
import DashboardMemberRoleDialog from "@/features/dashboard/components/DashboardMemberRoleDialog";
import type { DashboardMembersSectionProps } from "@/features/dashboard/components/DashboardMembersSection.types";
import { cn } from "@/lib/utils";

export default function DashboardMembersSection({
  title,
  userIdLabel,
  usernameLabel,
  roleLabel,
  invitationLinkLabel,
  invitationLinkPlaceholder,
  generateInviteLabel,
  copyLinkLabel,
  addLabel,
  updateLabel,
  cancelLabel,
  deleteLabel,
  emptyLabel,
  errorLabel,
  deleteConfirmTitle,
  deleteConfirmDescription,
  noPermissionLabel,
  canManage,
  members,
  roleOptions,
  draftUserId,
  draftRole,
  inviteRole,
  editingUserId,
  editingRole,
  invitationUrl,
  isLoading,
  isError,
  isSubmitting,
  isAddDialogOpen,
  isInviteDialogOpen,
  isEditDialogOpen,
  pendingDeleteUserId,
  onOpenAddDialog,
  onCloseAddDialog,
  onOpenInviteDialog,
  onCloseInviteDialog,
  onDraftUserIdChange,
  onDraftRoleChange,
  onInviteRoleChange,
  onEditingRoleChange,
  onSubmitAdd,
  onGenerateInvite,
  onCopyInvitationLink,
  onRequestEdit,
  onCloseEditDialog,
  onSubmitRoleUpdate,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: DashboardMembersSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("flex flex-row items-center justify-between px-4")}>
        <CardTitle className={cn("text-sm font-semibold text-slate-200")}>{title}</CardTitle>
        <div className={cn("flex items-center gap-2")}>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenInviteDialog}
            disabled={!canManage}
            title={!canManage ? noPermissionLabel : undefined}
            className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            <Link2 className={cn("size-4")} />
            {generateInviteLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onOpenAddDialog}
            disabled={!canManage}
            title={!canManage ? noPermissionLabel : undefined}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            <Plus className={cn("size-4")} />
            {addLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-3 px-4")}>
        <DashboardMemberList
          members={members}
          userIdLabel={userIdLabel}
          usernameLabel={usernameLabel}
          roleLabel={roleLabel}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={emptyLabel}
          errorLabel={errorLabel}
          updateLabel={updateLabel}
          deleteLabel={deleteLabel}
          canManage={canManage}
          onRequestEdit={onRequestEdit}
          onRequestDelete={onRequestDelete}
        />
        <DashboardMemberAddDialog
          title={title}
          userIdLabel={userIdLabel}
          roleLabel={roleLabel}
          addLabel={addLabel}
          cancelLabel={cancelLabel}
          draftUserId={draftUserId}
          draftRole={draftRole}
          roleOptions={roleOptions}
          isSubmitting={isSubmitting}
          isOpen={isAddDialogOpen}
          onClose={onCloseAddDialog}
          onDraftUserIdChange={onDraftUserIdChange}
          onDraftRoleChange={onDraftRoleChange}
          onSubmit={onSubmitAdd}
        />
        <DashboardMemberInviteDialog
          title={title}
          roleLabel={roleLabel}
          invitationLinkLabel={invitationLinkLabel}
          invitationLinkPlaceholder={invitationLinkPlaceholder}
          generateInviteLabel={generateInviteLabel}
          copyLinkLabel={copyLinkLabel}
          cancelLabel={cancelLabel}
          inviteRole={inviteRole}
          invitationUrl={invitationUrl}
          roleOptions={roleOptions}
          isSubmitting={isSubmitting}
          isOpen={isInviteDialogOpen}
          onClose={onCloseInviteDialog}
          onInviteRoleChange={onInviteRoleChange}
          onGenerateInvite={onGenerateInvite}
          onCopyInvitationLink={onCopyInvitationLink}
        />
        <DashboardMemberRoleDialog
          title={title}
          userIdLabel={userIdLabel}
          roleLabel={roleLabel}
          updateLabel={updateLabel}
          cancelLabel={cancelLabel}
          editingUserId={editingUserId}
          editingRole={editingRole}
          roleOptions={roleOptions}
          isSubmitting={isSubmitting}
          isOpen={isEditDialogOpen}
          onClose={onCloseEditDialog}
          onEditingRoleChange={onEditingRoleChange}
          onSubmit={onSubmitRoleUpdate}
        />
        <DashboardMemberDeleteDialog
          deleteConfirmTitle={deleteConfirmTitle}
          deleteConfirmDescription={deleteConfirmDescription}
          cancelLabel={cancelLabel}
          deleteLabel={deleteLabel}
          pendingDeleteUserId={pendingDeleteUserId}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={onConfirmDelete}
        />
      </CardContent>
    </Card>
  );
}
