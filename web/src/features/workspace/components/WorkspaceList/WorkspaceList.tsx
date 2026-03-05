import { Skeleton } from "@/components/ui/skeleton";
import type { WorkspaceItemData } from "@/features/workspace/components/types";
import { WorkspaceItem } from "@/features/workspace/components/WorkspaceItem/WorkspaceItem";
import { cn } from "@/lib/utils";

type WorkspaceListProps = {
  items: WorkspaceItemData[];
  activeWorkspaceId: string;
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  editLabel: string;
  transferOwnerLabel: string;
  deleteLabel: string;
  canManage: boolean;
  onSelectWorkspace: (workspaceId: string) => void;
  onEditWorkspace: (workspaceId: string) => void;
  onTransferWorkspaceOwner: (workspaceId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
};

export function WorkspaceList({
  items,
  activeWorkspaceId,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  editLabel,
  transferOwnerLabel,
  deleteLabel,
  canManage,
  onSelectWorkspace,
  onEditWorkspace,
  onTransferWorkspaceOwner,
  onDeleteWorkspace,
}: WorkspaceListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3")}>
        <Skeleton className={cn("h-16 rounded-xl bg-[#1a2a51]")} />
        <Skeleton className={cn("h-16 rounded-xl bg-[#1a2a51]")} />
      </div>
    );
  }

  if (isError) {
    return (
      <p className={cn("rounded-xl border border-rose-400/40 bg-rose-950/30 p-4 text-sm text-rose-100")}>
        {errorLabel}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "rounded-xl border border-dashed border-blue-300/30 bg-[#0b1737]/45 p-5 text-sm text-blue-100/70",
        )}
      >
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className={cn("space-y-3")}>
      {items.map((workspace) => {
        const isActive = workspace.id === activeWorkspaceId;

        return (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            isActive={isActive}
            canManage={canManage}
            editLabel={editLabel}
            transferOwnerLabel={transferOwnerLabel}
            deleteLabel={deleteLabel}
            onSelectWorkspace={onSelectWorkspace}
            onEditWorkspace={onEditWorkspace}
            onTransferWorkspaceOwner={onTransferWorkspaceOwner}
            onDeleteWorkspace={onDeleteWorkspace}
          />
        );
      })}
    </div>
  );
}
