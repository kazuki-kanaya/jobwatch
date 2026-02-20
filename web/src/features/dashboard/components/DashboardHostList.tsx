import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardHostItem } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardHostListProps = {
  hosts: DashboardHostItem[];
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  editLabel: string;
  deleteLabel: string;
  canManage: boolean;
  onStartEdit: (hostId: string) => void;
  onRequestDelete: (hostId: string) => void;
};

function DashboardHostList({
  hosts,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  editLabel,
  deleteLabel,
  canManage,
  onStartEdit,
  onRequestDelete,
}: DashboardHostListProps) {
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

  if (hosts.length === 0) {
    return (
      <p className={cn("rounded-md border border-dashed border-slate-600 p-4 text-sm text-slate-400")}>{emptyLabel}</p>
    );
  }

  return (
    <>
      {hosts.map((host) => (
        <article
          key={host.id}
          className={cn("flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/70 p-3")}
        >
          <div className={cn("flex min-w-0 items-center gap-2")}>
            <p className={cn("truncate text-sm font-medium text-slate-200")}>{host.name}</p>
            <p
              className={cn(
                "inline-flex items-center rounded-full border border-slate-600 bg-slate-900/70 px-2 py-0.5 font-mono text-[11px] text-slate-300",
              )}
              title={host.id}
            >
              <span className={cn("break-all")}>{host.id}</span>
            </p>
          </div>
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
              <DropdownMenuItem onSelect={() => canManage && onStartEdit(host.id)} disabled={!canManage}>
                <PencilLine className={cn("size-4")} />
                {editLabel}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => canManage && onRequestDelete(host.id)}
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

export default memo(DashboardHostList);
