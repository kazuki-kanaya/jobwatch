import type { WorkspaceItemData } from "@/features/workspace/components/types";
import { WorkspaceItemMenu } from "@/features/workspace/components/WorkspaceItemMenu/WorkspaceItemMenu";
import { cn } from "@/lib/utils";

type WorkspaceItemProps = {
  workspace: WorkspaceItemData;
  isActive: boolean;
  canManage: boolean;
  editLabel: string;
  transferOwnerLabel: string;
  deleteLabel: string;
  onSelectWorkspace: (workspaceId: string) => void;
  onEditWorkspace: (workspaceId: string) => void;
  onTransferWorkspaceOwner: (workspaceId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
};

export function WorkspaceItem({
  workspace,
  isActive,
  canManage,
  editLabel,
  transferOwnerLabel,
  deleteLabel,
  onSelectWorkspace,
  onEditWorkspace,
  onTransferWorkspaceOwner,
  onDeleteWorkspace,
}: WorkspaceItemProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors",
        isActive
          ? "border-sky-300/80 bg-sky-500/16 shadow-[0_0_0_1px_rgba(125,211,252,0.35),inset_0_1px_0_rgba(224,242,254,0.18)]"
          : "border-[#304a79] bg-[#1a2849]/65 hover:border-[#4668a6] hover:bg-[#1d2d54]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-2 bottom-2 left-0 w-1 rounded-r-full transition-opacity",
          isActive ? "bg-sky-300/95 opacity-100" : "opacity-0",
        )}
      />
      <button
        type="button"
        onClick={() => onSelectWorkspace(workspace.id)}
        className={cn("min-w-0 flex-1 text-left focus-visible:outline-none")}
      >
        <div className={cn("min-w-0 space-y-1")}>
          <div className={cn("flex min-w-0 items-center gap-2.5")}>
            <span className={cn("truncate text-base font-semibold", isActive ? "text-sky-50" : "text-slate-100/90")}>
              {workspace.name}
            </span>
          </div>
          <p
            className={cn("truncate font-mono text-sm", isActive ? "text-sky-100/80" : "text-blue-100/55")}
            title={workspace.id}
          >
            {workspace.id}
          </p>
        </div>
      </button>
      <WorkspaceItemMenu
        workspaceId={workspace.id}
        canManage={canManage}
        editLabel={editLabel}
        transferOwnerLabel={transferOwnerLabel}
        deleteLabel={deleteLabel}
        onEditWorkspace={onEditWorkspace}
        onTransferWorkspaceOwner={onTransferWorkspaceOwner}
        onDeleteWorkspace={onDeleteWorkspace}
      />
    </article>
  );
}
