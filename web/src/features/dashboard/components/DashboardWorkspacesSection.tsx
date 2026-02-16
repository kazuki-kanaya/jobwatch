// Responsibility: Compose workspace list and dialogs for workspace CRUD and ownership transfer.
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardWorkspaceDeleteDialog from "@/features/dashboard/components/DashboardWorkspaceDeleteDialog";
import DashboardWorkspaceFormDialog from "@/features/dashboard/components/DashboardWorkspaceFormDialog";
import DashboardWorkspaceInvitationsSection from "@/features/dashboard/components/DashboardWorkspaceInvitationsSection";
import DashboardWorkspaceList from "@/features/dashboard/components/DashboardWorkspaceList";
import type { DashboardWorkspacesSectionProps } from "@/features/dashboard/components/DashboardWorkspacesSection.types";
import DashboardWorkspaceTransferDialog from "@/features/dashboard/components/DashboardWorkspaceTransferDialog";
import { cn } from "@/lib/utils";

export default function DashboardWorkspacesSection({
  title,
  workspaceNameLabel,
  activeWorkspaceName,
  newOwnerUserIdLabel,
  transferOwnerLabel,
  invitationsTitle,
  invitationRoleLabel,
  invitationCreatedByLabel,
  invitationExpiresAtLabel,
  invitationUsedAtLabel,
  invitationStatusActiveLabel,
  invitationStatusUsedLabel,
  invitationStatusExpiredLabel,
  invitationRevokeConfirmTitle,
  invitationRevokeConfirmDescription,
  revokeLabel,
  invitationsEmptyLabel,
  invitationsErrorLabel,
  addLabel,
  updateLabel,
  cancelLabel,
  deleteLabel,
  emptyLabel,
  errorLabel,
  deleteConfirmTitle,
  deleteConfirmDescription,
  noPermissionLabel,
  canCreate,
  canManage,
  workspaces,
  invitations,
  workspaceDraftName,
  transferOwnerUserId,
  transferOwnerOptions,
  editingWorkspaceId,
  transferWorkspaceId,
  pendingDeleteWorkspaceId,
  pendingRevokeInvitationId,
  isLoading,
  isError,
  isInvitationsLoading,
  isInvitationsError,
  isSubmitting,
  isFormOpen,
  isTransferDialogOpen,
  onOpenCreate,
  onStartEdit,
  onDraftNameChange,
  onCloseForm,
  onSubmitWorkspace,
  onOpenTransfer,
  onTransferOwnerUserIdChange,
  onCloseTransfer,
  onSubmitTransfer,
  onRequestRevokeInvitation,
  onCancelRevokeInvitation,
  onConfirmRevokeInvitation,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: DashboardWorkspacesSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("flex flex-row items-center justify-between px-4")}>
        <CardTitle className={cn("text-sm font-semibold text-slate-200")}>{title}</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={onOpenCreate}
          disabled={!canCreate}
          title={!canCreate ? noPermissionLabel : undefined}
          className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
        >
          <Plus className={cn("size-4")} />
          {addLabel}
        </Button>
      </CardHeader>
      <CardContent className={cn("space-y-3 px-4")}>
        <DashboardWorkspaceList
          workspaces={workspaces}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={emptyLabel}
          errorLabel={errorLabel}
          updateLabel={updateLabel}
          transferOwnerLabel={transferOwnerLabel}
          deleteLabel={deleteLabel}
          canManage={canManage}
          onStartEdit={onStartEdit}
          onOpenTransfer={onOpenTransfer}
          onRequestDelete={onRequestDelete}
        />
        <DashboardWorkspaceFormDialog
          title={title}
          workspaceNameLabel={workspaceNameLabel}
          addLabel={addLabel}
          updateLabel={updateLabel}
          cancelLabel={cancelLabel}
          workspaceDraftName={workspaceDraftName}
          isEditing={Boolean(editingWorkspaceId)}
          isSubmitting={isSubmitting}
          isOpen={isFormOpen}
          onClose={onCloseForm}
          onDraftNameChange={onDraftNameChange}
          onSubmit={onSubmitWorkspace}
        />
        <DashboardWorkspaceTransferDialog
          title={title}
          newOwnerUserIdLabel={newOwnerUserIdLabel}
          transferOwnerLabel={transferOwnerLabel}
          cancelLabel={cancelLabel}
          transferOwnerUserId={transferOwnerUserId}
          transferOwnerOptions={transferOwnerOptions}
          transferWorkspaceId={transferWorkspaceId}
          isSubmitting={isSubmitting}
          isOpen={isTransferDialogOpen}
          onClose={onCloseTransfer}
          onTransferOwnerUserIdChange={onTransferOwnerUserIdChange}
          onSubmit={onSubmitTransfer}
        />
        <DashboardWorkspaceInvitationsSection
          title={invitationsTitle}
          workspaceLabel={workspaceNameLabel}
          workspaceName={activeWorkspaceName}
          roleLabel={invitationRoleLabel}
          createdByLabel={invitationCreatedByLabel}
          expiresAtLabel={invitationExpiresAtLabel}
          usedAtLabel={invitationUsedAtLabel}
          statusActiveLabel={invitationStatusActiveLabel}
          statusUsedLabel={invitationStatusUsedLabel}
          statusExpiredLabel={invitationStatusExpiredLabel}
          revokeConfirmTitle={invitationRevokeConfirmTitle}
          revokeConfirmDescription={invitationRevokeConfirmDescription}
          revokeLabel={revokeLabel}
          cancelLabel={cancelLabel}
          emptyLabel={invitationsEmptyLabel}
          errorLabel={invitationsErrorLabel}
          canManage={canManage}
          noPermissionLabel={noPermissionLabel}
          invitations={invitations}
          isLoading={isInvitationsLoading}
          isError={isInvitationsError}
          isSubmitting={isSubmitting}
          pendingRevokeInvitationId={pendingRevokeInvitationId}
          onRequestRevoke={onRequestRevokeInvitation}
          onCancelRevoke={onCancelRevokeInvitation}
          onConfirmRevoke={onConfirmRevokeInvitation}
        />
        <DashboardWorkspaceDeleteDialog
          deleteConfirmTitle={deleteConfirmTitle}
          deleteConfirmDescription={deleteConfirmDescription}
          cancelLabel={cancelLabel}
          deleteLabel={deleteLabel}
          pendingDeleteWorkspaceId={pendingDeleteWorkspaceId}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={onConfirmDelete}
        />
      </CardContent>
    </Card>
  );
}
