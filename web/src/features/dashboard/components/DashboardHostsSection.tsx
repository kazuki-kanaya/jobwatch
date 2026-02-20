import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHostDeleteDialog from "@/features/dashboard/components/DashboardHostDeleteDialog";
import DashboardHostFormDialog from "@/features/dashboard/components/DashboardHostFormDialog";
import DashboardHostList from "@/features/dashboard/components/DashboardHostList";
import type { DashboardHostsSectionProps } from "@/features/dashboard/components/DashboardHostsSection.types";
import { cn } from "@/lib/utils";

export default function DashboardHostsSection({
  title,
  hostNameLabel,
  addLabel,
  editLabel,
  updateLabel,
  cancelLabel,
  deleteLabel,
  emptyLabel,
  errorLabel,
  tokenLabel,
  tokenCopyLabel,
  tokenValue,
  tokenMessage,
  deleteConfirmTitle,
  deleteConfirmDescription,
  noPermissionLabel,
  canManage,
  draftName,
  editingHostId,
  hosts,
  isLoading,
  isError,
  isSubmitting,
  isFormOpen,
  pendingDeleteHostId,
  onOpenCreate,
  onDraftNameChange,
  onSubmit,
  onCopyToken,
  onStartEdit,
  onCloseForm,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: DashboardHostsSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("flex flex-row items-center justify-between px-4")}>
        <CardTitle className={cn("text-sm font-semibold text-slate-200")}>{title}</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={onOpenCreate}
          disabled={!canManage}
          title={!canManage ? noPermissionLabel : undefined}
          className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
        >
          <Plus className={cn("size-4")} />
          {addLabel}
        </Button>
      </CardHeader>
      <CardContent className={cn("space-y-3 px-4")}>
        {tokenValue ? (
          <div
            className={cn("space-y-2 rounded-md border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-200")}
          >
            <p className={cn("text-xs text-amber-100/90")}>{tokenMessage ?? ""}</p>
            <p className={cn("break-all text-xs")}>
              <span className={cn("font-semibold")}>{tokenLabel}:</span> {tokenValue}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onCopyToken}
              className={cn("border-amber-200/40 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20")}
            >
              {tokenCopyLabel}
            </Button>
          </div>
        ) : null}

        <DashboardHostList
          hosts={hosts}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={emptyLabel}
          errorLabel={errorLabel}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          canManage={canManage}
          onStartEdit={onStartEdit}
          onRequestDelete={onRequestDelete}
        />
        <DashboardHostFormDialog
          title={title}
          hostNameLabel={hostNameLabel}
          addLabel={addLabel}
          updateLabel={updateLabel}
          cancelLabel={cancelLabel}
          draftName={draftName}
          isEditing={Boolean(editingHostId)}
          isSubmitting={isSubmitting}
          isOpen={isFormOpen}
          onClose={onCloseForm}
          onDraftNameChange={onDraftNameChange}
          onSubmit={onSubmit}
        />
        <DashboardHostDeleteDialog
          deleteConfirmTitle={deleteConfirmTitle}
          deleteConfirmDescription={deleteConfirmDescription}
          cancelLabel={cancelLabel}
          deleteLabel={deleteLabel}
          pendingDeleteHostId={pendingDeleteHostId}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={onConfirmDelete}
        />
      </CardContent>
    </Card>
  );
}
