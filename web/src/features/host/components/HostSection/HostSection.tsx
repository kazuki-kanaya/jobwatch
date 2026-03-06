import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HostCreateButton } from "@/features/host/components/HostCreateButton/HostCreateButton";
import { HostDeleteDialog } from "@/features/host/components/HostDeleteDialog/HostDeleteDialog";
import { HostFormDialog } from "@/features/host/components/HostFormDialog/HostFormDialog";
import { HostList } from "@/features/host/components/HostList/HostList";
import { HostTokenDialog } from "@/features/host/components/HostTokenDialog/HostTokenDialog";
import type { HostItemData, HostViewState } from "@/features/host/components/types";
import { cn } from "@/lib/utils";

type HostSectionProps = {
  title: string;
  scopeLabel: string;
  scopeName: string;
  scopeId: string;
  scopeHint?: string;
  emptyLabel: string;
  errorLabel: string;
  state: HostViewState;
  hosts: HostItemData[];
  canCreate: boolean;
  canManage: boolean;
  noPermissionLabel: string;
  addLabel: string;
  editLabel: string;
  deleteLabel: string;
  hostNameLabel: string;
  createLabel: string;
  updateLabel: string;
  formTitle: string;
  formDescription: string;
  deleteDialogTitle: string;
  deleteDialogDescription: string;
  tokenDialogTitle: string;
  tokenDialogDescription: string;
  tokenLabel: string;
  tokenCopyLabel: string;
  closeLabel: string;
  cancelLabel: string;
  isSubmitting: boolean;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  hostDraftName: string;
  isEditing: boolean;
  hostToken: string | null;
  hostTokenMessage: string | null;
  onCreateHost: () => void;
  onEditHost: (hostId: string) => void;
  onDeleteHost: (hostId: string) => void;
  onHostDraftNameChange: (value: string) => void;
  onSubmitHost: () => void;
  onSubmitDeleteHost: () => void;
  onCloseHostForm: () => void;
  onCloseDeleteDialog: () => void;
  onCopyHostToken: () => void;
  onCloseHostTokenDialog: () => void;
};

export function HostSection({
  title,
  scopeLabel,
  scopeName,
  scopeId,
  scopeHint,
  emptyLabel,
  errorLabel,
  state,
  hosts,
  canCreate,
  canManage,
  noPermissionLabel,
  addLabel,
  editLabel,
  deleteLabel,
  hostNameLabel,
  createLabel,
  updateLabel,
  formTitle,
  formDescription,
  deleteDialogTitle,
  deleteDialogDescription,
  tokenDialogTitle,
  tokenDialogDescription,
  tokenLabel,
  tokenCopyLabel,
  closeLabel,
  cancelLabel,
  isSubmitting,
  isFormOpen,
  isDeleteDialogOpen,
  hostDraftName,
  isEditing,
  hostToken,
  hostTokenMessage,
  onCreateHost,
  onEditHost,
  onDeleteHost,
  onHostDraftNameChange,
  onSubmitHost,
  onSubmitDeleteHost,
  onCloseHostForm,
  onCloseDeleteDialog,
  onCopyHostToken,
  onCloseHostTokenDialog,
}: HostSectionProps) {
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
          <HostCreateButton
            addLabel={addLabel}
            noPermissionLabel={noPermissionLabel}
            canCreate={canCreate}
            onCreateHost={onCreateHost}
          />
        </div>
        <Card
          className={cn(
            "rounded-2xl border border-[#33538b]/70 bg-[#0b1a3f]/70 py-4 shadow-[inset_0_1px_0_rgba(151,180,255,0.08)]",
          )}
        >
          <CardContent className={cn("space-y-3 px-5")}>
            <p className={cn("text-[11px] font-semibold tracking-[0.2em] text-blue-200/65 uppercase")}>{scopeLabel}</p>
            <p className={cn("text-2xl font-semibold leading-tight text-blue-50 md:text-[2rem]")}>{scopeName}</p>
            <p className={cn("truncate text-sm text-blue-100/75")} title={scopeId}>
              <span className={cn("font-medium text-blue-100/80")}>Workspace ID:</span>{" "}
              <span className={cn("font-mono text-base text-blue-50/95")}>{scopeId}</span>
            </p>
            {scopeHint ? <p className={cn("text-sm text-blue-100/65")}>{scopeHint}</p> : null}
          </CardContent>
        </Card>
      </CardHeader>

      <CardContent className={cn("space-y-5 px-6")}>
        <HostList
          items={hosts}
          isLoading={isLoading}
          isError={isError}
          emptyLabel={emptyLabel}
          errorLabel={errorLabel}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          canManage={canManage}
          onEditHost={onEditHost}
          onDeleteHost={onDeleteHost}
        />

        <HostFormDialog
          title={formTitle}
          description={formDescription}
          hostNameLabel={hostNameLabel}
          createLabel={createLabel}
          updateLabel={updateLabel}
          cancelLabel={cancelLabel}
          hostDraftName={hostDraftName}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          isOpen={isFormOpen}
          onClose={onCloseHostForm}
          onHostDraftNameChange={onHostDraftNameChange}
          onSubmit={onSubmitHost}
        />

        <HostDeleteDialog
          title={deleteDialogTitle}
          description={deleteDialogDescription}
          cancelLabel={cancelLabel}
          confirmLabel={deleteLabel}
          isSubmitting={isSubmitting}
          isOpen={isDeleteDialogOpen}
          onClose={onCloseDeleteDialog}
          onConfirm={onSubmitDeleteHost}
        />

        <HostTokenDialog
          title={tokenDialogTitle}
          description={tokenDialogDescription}
          tokenLabel={tokenLabel}
          copyLabel={tokenCopyLabel}
          closeLabel={closeLabel}
          token={hostToken}
          tokenMessage={hostTokenMessage}
          isOpen={Boolean(hostToken)}
          onCopy={onCopyHostToken}
          onClose={onCloseHostTokenDialog}
        />
      </CardContent>
    </Card>
  );
}
