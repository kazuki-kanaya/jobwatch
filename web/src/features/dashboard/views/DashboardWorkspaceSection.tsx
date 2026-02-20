import DashboardWorkspacesSection from "@/features/dashboard/components/DashboardWorkspacesSection";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";

type DashboardWorkspaceSectionProps = Pick<DashboardPageViewProps, "model" | "workspaceManagement">;

export default function DashboardWorkspaceSection({ model, workspaceManagement }: DashboardWorkspaceSectionProps) {
  const transferOwnerOptions = workspaceManagement.transferOwnerOptions;

  return (
    <DashboardWorkspacesSection
      title={model.texts.workspaces}
      workspaceNameLabel={model.texts.workspaceName}
      activeWorkspaceId={model.filters.workspaceId}
      newOwnerUserIdLabel={model.texts.workspaceNewOwnerUserId}
      transferOwnerLabel={model.texts.workspaceTransferOwner}
      addLabel={model.texts.add}
      editLabel={model.texts.edit}
      updateLabel={model.texts.edit}
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
      workspaceDraftName={workspaceManagement.workspaceDraftName}
      transferOwnerUserId={workspaceManagement.transferOwnerUserId}
      transferOwnerOptions={transferOwnerOptions}
      editingWorkspaceId={workspaceManagement.editingWorkspaceId}
      transferWorkspaceId={workspaceManagement.transferWorkspaceId}
      pendingDeleteWorkspaceId={workspaceManagement.pendingDeleteWorkspaceId}
      isLoading={workspaceManagement.isWorkspacesLoading}
      isError={workspaceManagement.isWorkspacesError}
      isSubmitting={workspaceManagement.isWorkspaceSubmitting}
      isFormOpen={workspaceManagement.isWorkspaceFormOpen}
      isTransferDialogOpen={workspaceManagement.isWorkspaceTransferDialogOpen}
      onSelectWorkspace={workspaceManagement.onSelectWorkspace}
      onOpenCreate={workspaceManagement.onOpenWorkspaceCreateForm}
      onStartEdit={workspaceManagement.onStartEditWorkspace}
      onDraftNameChange={workspaceManagement.onWorkspaceDraftNameChange}
      onCloseForm={workspaceManagement.onCloseWorkspaceForm}
      onSubmitWorkspace={workspaceManagement.onSubmitWorkspace}
      onOpenTransfer={workspaceManagement.onOpenWorkspaceTransferDialog}
      onTransferOwnerUserIdChange={workspaceManagement.onTransferOwnerUserIdChange}
      onCloseTransfer={workspaceManagement.onCloseWorkspaceTransferDialog}
      onSubmitTransfer={workspaceManagement.onSubmitWorkspaceTransfer}
      onRequestDelete={workspaceManagement.onRequestDeleteWorkspace}
      onCancelDelete={workspaceManagement.onCancelDeleteWorkspace}
      onConfirmDelete={workspaceManagement.onConfirmDeleteWorkspace}
    />
  );
}
