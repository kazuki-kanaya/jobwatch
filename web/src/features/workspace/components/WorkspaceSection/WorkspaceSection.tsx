import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  WorkspaceItemData,
  WorkspaceOwnerOption,
  WorkspaceViewState,
} from "@/features/workspace/components/types";
import { WorkspaceCreateButton } from "@/features/workspace/components/WorkspaceCreateButton/WorkspaceCreateButton";
import { WorkspaceDeleteDialog } from "@/features/workspace/components/WorkspaceDeleteDialog/WorkspaceDeleteDialog";
import { WorkspaceFormDialog } from "@/features/workspace/components/WorkspaceFormDialog/WorkspaceFormDialog";
import { WorkspaceList } from "@/features/workspace/components/WorkspaceList/WorkspaceList";
import { WorkspaceSummary } from "@/features/workspace/components/WorkspaceSummary/WorkspaceSummary";
import { WorkspaceTransferDialog } from "@/features/workspace/components/WorkspaceTransferDialog/WorkspaceTransferDialog";
import { cn } from "@/lib/utils";

type WorkspaceSectionProps = {
  title: string;
  summaryLabel: string;
  summaryHint?: string;
  emptyLabel: string;
  errorLabel: string;
  state: WorkspaceViewState;
  activeWorkspaceId: string;
  selectedWorkspaceName: string;
  workspaces: WorkspaceItemData[];
  ownerOptions: WorkspaceOwnerOption[];
  canCreate: boolean;
  canManage: boolean;
  noPermissionLabel: string;
  editLabel: string;
  addLabel: string;
  deleteLabel: string;
  transferOwnerLabel: string;
  formTitle: string;
  formDescription: string;
  workspaceNameLabel: string;
  createLabel: string;
  updateLabel: string;
  transferDialogTitle: string;
  transferDialogDescription: string;
  ownerUserIdLabel: string;
  deleteDialogTitle: string;
  deleteDialogDescription: string;
  cancelLabel: string;
  isSubmitting: boolean;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  isTransferDialogOpen: boolean;
  isEditing: boolean;
  transferWorkspaceId: string | null;
  workspaceDraftName: string;
  transferOwnerUserId: string;
  onSelectWorkspace: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
  onEditWorkspace: (workspaceId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onTransferWorkspaceOwner: (workspaceId: string) => void;
  onWorkspaceDraftNameChange: (value: string) => void;
  onTransferOwnerUserIdChange: (value: string) => void;
  onSubmitWorkspace: () => void;
  onSubmitDeleteWorkspace: () => void;
  onSubmitTransferWorkspaceOwner: () => void;
  onCloseWorkspaceForm: () => void;
  onCloseDeleteDialog: () => void;
  onCloseTransferDialog: () => void;
};

export function WorkspaceSection({
  title,
  summaryLabel,
  summaryHint,
  emptyLabel,
  errorLabel,
  state,
  activeWorkspaceId,
  selectedWorkspaceName,
  workspaces,
  ownerOptions,
  canCreate,
  canManage,
  noPermissionLabel,
  editLabel,
  addLabel,
  deleteLabel,
  transferOwnerLabel,
  formTitle,
  formDescription,
  workspaceNameLabel,
  createLabel,
  updateLabel,
  transferDialogTitle,
  transferDialogDescription,
  ownerUserIdLabel,
  deleteDialogTitle,
  deleteDialogDescription,
  cancelLabel,
  isSubmitting,
  isFormOpen,
  isDeleteDialogOpen,
  isTransferDialogOpen,
  isEditing,
  transferWorkspaceId,
  workspaceDraftName,
  transferOwnerUserId,
  onSelectWorkspace,
  onCreateWorkspace,
  onEditWorkspace,
  onDeleteWorkspace,
  onTransferWorkspaceOwner,
  onWorkspaceDraftNameChange,
  onTransferOwnerUserIdChange,
  onSubmitWorkspace,
  onSubmitDeleteWorkspace,
  onSubmitTransferWorkspaceOwner,
  onCloseWorkspaceForm,
  onCloseDeleteDialog,
  onCloseTransferDialog,
}: WorkspaceSectionProps) {
  const isLoading = state === "loading";
  const isError = state === "error";

  return (
    <Card
      className={cn(
        "relative rounded-3xl border border-[#2a3d64]/80 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(80,143,255,0.22)_0%,rgba(9,20,48,0.96)_45%,rgba(3,10,28,0.98)_100%)] py-5 shadow-[0_24px_64px_rgba(3,8,24,0.55)]",
      )}
    >
      <CardHeader className={cn("space-y-5 px-6 pb-4")}>
        <div className={cn("flex flex-wrap items-center justify-between gap-3")}>
          <CardTitle className={cn("text-2xl font-semibold tracking-tight text-slate-100")}>{title}</CardTitle>
          <WorkspaceCreateButton
            addLabel={addLabel}
            noPermissionLabel={noPermissionLabel}
            canCreate={canCreate}
            onCreateWorkspace={onCreateWorkspace}
          />
        </div>
        <WorkspaceSummary
          title={summaryLabel}
          workspaceId={activeWorkspaceId || "-"}
          workspaceName={selectedWorkspaceName}
          hint={summaryHint}
        />
      </CardHeader>

      <CardContent className={cn("space-y-5 px-6")}>
        <WorkspaceList
          items={workspaces}
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
          onEditWorkspace={onEditWorkspace}
          onTransferWorkspaceOwner={onTransferWorkspaceOwner}
          onDeleteWorkspace={onDeleteWorkspace}
        />

        <WorkspaceFormDialog
          title={formTitle}
          description={formDescription}
          workspaceNameLabel={workspaceNameLabel}
          createLabel={createLabel}
          updateLabel={updateLabel}
          cancelLabel={cancelLabel}
          workspaceDraftName={workspaceDraftName}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          isOpen={isFormOpen}
          onClose={onCloseWorkspaceForm}
          onWorkspaceDraftNameChange={onWorkspaceDraftNameChange}
          onSubmit={onSubmitWorkspace}
        />

        <WorkspaceTransferDialog
          title={transferDialogTitle}
          description={transferDialogDescription}
          ownerUserIdLabel={ownerUserIdLabel}
          transferLabel={transferOwnerLabel}
          cancelLabel={cancelLabel}
          workspaceId={transferWorkspaceId}
          ownerUserId={transferOwnerUserId}
          ownerOptions={ownerOptions}
          isSubmitting={isSubmitting}
          isOpen={isTransferDialogOpen}
          onClose={onCloseTransferDialog}
          onOwnerUserIdChange={onTransferOwnerUserIdChange}
          onSubmit={onSubmitTransferWorkspaceOwner}
        />

        <WorkspaceDeleteDialog
          title={deleteDialogTitle}
          description={deleteDialogDescription}
          cancelLabel={cancelLabel}
          confirmLabel={deleteLabel}
          isSubmitting={isSubmitting}
          isOpen={isDeleteDialogOpen}
          onClose={onCloseDeleteDialog}
          onConfirm={onSubmitDeleteWorkspace}
        />
      </CardContent>
    </Card>
  );
}
