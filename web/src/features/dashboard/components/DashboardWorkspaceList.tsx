import { Crown, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSelectOption } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardWorkspaceListProps = {
  workspaces: DashboardSelectOption[];
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
  onStartEdit: (workspaceId: string) => void;
  onOpenTransfer: (workspaceId: string) => void;
  onRequestDelete: (workspaceId: string) => void;
};

function DashboardWorkspaceList({
  workspaces,
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
  onStartEdit,
  onOpenTransfer,
  onRequestDelete,
}: DashboardWorkspaceListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-2")}>
        <Skeleton className={cn("h-12 bg-slate-800")} />
        <Skeleton className={cn("h-12 bg-slate-800")} />
      </div>
    );
  }

  if (isError) {
    return (
      <p className={cn("rounded-md border border-rose-400/40 bg-rose-950/40 p-3 text-sm text-rose-200")}>
        {errorLabel}
      </p>
    );
  }

  if (workspaces.length === 0) {
    return (
      <p className={cn("rounded-md border border-dashed border-slate-600 p-4 text-sm text-slate-400")}>{emptyLabel}</p>
    );
  }

  return (
    <>
      {workspaces.map((workspace) => {
        const isActive = workspace.id === activeWorkspaceId;

        return (
          <article
            key={workspace.id}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md border p-3 transition",
              isActive
                ? "border-cyan-400/60 bg-cyan-500/10 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]"
                : "border-slate-700 bg-slate-800/70 hover:border-slate-600",
            )}
          >
            <button type="button" onClick={() => onSelectWorkspace(workspace.id)} className={cn("min-w-0 flex-1")}>
              <div className={cn("flex min-w-0 items-center gap-2")}>
                <span className={cn("truncate text-sm font-medium", isActive ? "text-cyan-100" : "text-slate-200")}>
                  {workspace.name}
                </span>
                <p
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px]",
                    isActive
                      ? "border-cyan-300/35 bg-cyan-500/10 text-cyan-100"
                      : "border-slate-600 bg-slate-900/70 text-slate-300",
                  )}
                  title={workspace.id}
                >
                  <span className={cn("break-all")}>{workspace.id}</span>
                </p>
                {isActive ? (
                  <span
                    className={cn(
                      "rounded-full border border-cyan-300/40 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-100 uppercase",
                    )}
                  >
                    Active
                  </span>
                ) : null}
              </div>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
                >
                  <MoreHorizontal className={cn("size-4")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
                <DropdownMenuItem onSelect={() => canManage && onStartEdit(workspace.id)} disabled={!canManage}>
                  <PencilLine className={cn("size-4")} />
                  {editLabel}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => canManage && onOpenTransfer(workspace.id)} disabled={!canManage}>
                  <Crown className={cn("size-4")} />
                  {transferOwnerLabel}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => canManage && onRequestDelete(workspace.id)}
                  disabled={!canManage}
                >
                  <Trash2 className={cn("size-4")} />
                  {deleteLabel}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </article>
        );
      })}
    </>
  );
}

export default memo(DashboardWorkspaceList);
