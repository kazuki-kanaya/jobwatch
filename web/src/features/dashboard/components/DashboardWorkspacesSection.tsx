import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardWorkspaceDeleteDialog from "@/features/dashboard/components/DashboardWorkspaceDeleteDialog";
import DashboardWorkspaceFormDialog from "@/features/dashboard/components/DashboardWorkspaceFormDialog";
import DashboardWorkspaceList from "@/features/dashboard/components/DashboardWorkspaceList";
import type { DashboardWorkspacesSectionProps } from "@/features/dashboard/components/DashboardWorkspacesSection.types";
import DashboardWorkspaceTransferDialog from "@/features/dashboard/components/DashboardWorkspaceTransferDialog";
import { cn } from "@/lib/utils";

export default function DashboardWorkspacesSection({
  title,
  workspaceNameLabel,
  activeWorkspaceId,
  newOwnerUserIdLabel,
  transferOwnerLabel,
  addLabel,
  editLabel,
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
  workspaceDraftName,
  transferOwnerUserId,
  transferOwnerOptions,
  editingWorkspaceId,
  transferWorkspaceId,
  pendingDeleteWorkspaceId,
  isLoading,
  isError,
  isSubmitting,
  isFormOpen,
  isTransferDialogOpen,
  onSelectWorkspace,
  onOpenCreate,
  onStartEdit,
  onDraftNameChange,
  onCloseForm,
  onSubmitWorkspace,
  onOpenTransfer,
  onTransferOwnerUserIdChange,
  onCloseTransfer,
  onSubmitTransfer,
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
          activeWorkspaceId={activeWorkspaceId}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={emptyLabel}
          errorLabel={errorLabel}
          editLabel={editLabel}
          transferOwnerLabel={transferOwnerLabel}
          deleteLabel={deleteLabel}
          canManage={canManage}
          onSelectWorkspace={onSelectWorkspace}
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
