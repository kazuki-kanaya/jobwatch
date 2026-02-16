import { Crown, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
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
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  updateLabel: string;
  transferOwnerLabel: string;
  deleteLabel: string;
  canManage: boolean;
  onStartEdit: (workspaceId: string) => void;
  onOpenTransfer: (workspaceId: string) => void;
  onRequestDelete: (workspaceId: string) => void;
};

export default function DashboardWorkspaceList({
  workspaces,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  updateLabel,
  transferOwnerLabel,
  deleteLabel,
  canManage,
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
      {workspaces.map((workspace) => (
        <article
          key={workspace.id}
          className={cn("flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/70 p-3")}
        >
          <p className={cn("text-sm text-slate-200")}>{workspace.name}</p>
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
                {updateLabel}
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
      ))}
    </>
  );
}
