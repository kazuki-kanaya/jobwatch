import DashboardWorkspacesSection from "@/features/dashboard/components/DashboardWorkspacesSection";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";

type DashboardWorkspaceSectionProps = Pick<DashboardPageViewProps, "model" | "workspaceManagement">;

export default function DashboardWorkspaceSection({ model, workspaceManagement }: DashboardWorkspaceSectionProps) {
  const transferOwnerOptions = workspaceManagement.transferOwnerOptions;
  const activeWorkspaceName =
    model.filters.workspaceOptions.find((workspace) => workspace.id === model.filters.workspaceId)?.name ?? "-";

  return (
    <DashboardWorkspacesSection
      title={model.texts.workspaces}
      workspaceNameLabel={model.texts.workspaceName}
      activeWorkspaceName={activeWorkspaceName}
      newOwnerUserIdLabel={model.texts.workspaceNewOwnerUserId}
      transferOwnerLabel={model.texts.workspaceTransferOwner}
      invitationsTitle={model.texts.invitations}
      invitationRoleLabel={model.texts.invitationRole}
      invitationCreatedByLabel={model.texts.invitationCreatedBy}
      invitationExpiresAtLabel={model.texts.invitationExpiresAt}
      invitationUsedAtLabel={model.texts.invitationUsedAt}
      invitationStatusActiveLabel={model.texts.invitationStatusActive}
      invitationStatusUsedLabel={model.texts.invitationStatusUsed}
      invitationStatusExpiredLabel={model.texts.invitationStatusExpired}
      invitationRevokeConfirmTitle={model.texts.invitationRevokeConfirmTitle}
      invitationRevokeConfirmDescription={model.texts.invitationRevokeConfirmDescription}
      revokeLabel={model.texts.delete}
      invitationsEmptyLabel={model.texts.invitationsEmpty}
      invitationsErrorLabel={model.texts.invitationsError}
      addLabel={model.texts.add}
      updateLabel={model.texts.update}
      cancelLabel={model.texts.cancel}
      deleteLabel={model.texts.delete}
      emptyLabel={model.texts.workspacesEmpty}
      errorLabel={model.texts.workspacesError}
      deleteConfirmTitle={model.texts.workspaceDeleteConfirmTitle}
      deleteConfirmDescription={model.texts.workspaceDeleteConfirmDescription}
      noPermissionLabel={model.texts.noPermission}
      canCreate={workspaceManagement.canCreateWorkspace}
      canManage={workspaceManagement.canManageWorkspace}
      workspaces={model.filters.workspaceOptions}
      invitations={workspaceManagement.invitations}
      workspaceDraftName={workspaceManagement.workspaceDraftName}
      transferOwnerUserId={workspaceManagement.transferOwnerUserId}
      transferOwnerOptions={transferOwnerOptions}
      editingWorkspaceId={workspaceManagement.editingWorkspaceId}
      transferWorkspaceId={workspaceManagement.transferWorkspaceId}
      pendingDeleteWorkspaceId={workspaceManagement.pendingDeleteWorkspaceId}
      pendingRevokeInvitationId={workspaceManagement.pendingRevokeInvitationId}
      isLoading={workspaceManagement.isWorkspacesLoading}
      isError={workspaceManagement.isWorkspacesError}
      isInvitationsLoading={workspaceManagement.isInvitationsLoading}
      isInvitationsError={workspaceManagement.isInvitationsError}
      isSubmitting={workspaceManagement.isWorkspaceSubmitting}
      isFormOpen={workspaceManagement.isWorkspaceFormOpen}
      isTransferDialogOpen={workspaceManagement.isWorkspaceTransferDialogOpen}
      onOpenCreate={workspaceManagement.onOpenWorkspaceCreateForm}
      onStartEdit={workspaceManagement.onStartEditWorkspace}
      onDraftNameChange={workspaceManagement.onWorkspaceDraftNameChange}
      onCloseForm={workspaceManagement.onCloseWorkspaceForm}
      onSubmitWorkspace={workspaceManagement.onSubmitWorkspace}
      onOpenTransfer={workspaceManagement.onOpenWorkspaceTransferDialog}
      onTransferOwnerUserIdChange={workspaceManagement.onTransferOwnerUserIdChange}
      onCloseTransfer={workspaceManagement.onCloseWorkspaceTransferDialog}
      onSubmitTransfer={workspaceManagement.onSubmitWorkspaceTransfer}
      onRequestRevokeInvitation={workspaceManagement.onRequestRevokeInvitation}
      onCancelRevokeInvitation={workspaceManagement.onCancelRevokeInvitation}
      onConfirmRevokeInvitation={workspaceManagement.onConfirmRevokeInvitation}
      onRequestDelete={workspaceManagement.onRequestDeleteWorkspace}
      onCancelDelete={workspaceManagement.onCancelDeleteWorkspace}
      onConfirmDelete={workspaceManagement.onConfirmDeleteWorkspace}
    />
  );
}
