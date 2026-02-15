// Responsibility: Render members list states (loading, error, empty, data rows) with row actions.
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardMemberItem } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardMemberListProps = {
  members: DashboardMemberItem[];
  userIdLabel: string;
  usernameLabel: string;
  roleLabel: string;
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  updateLabel: string;
  deleteLabel: string;
  canManage: boolean;
  onRequestEdit: (userId: string, role: DashboardMemberItem["role"]) => void;
  onRequestDelete: (userId: string) => void;
};

export default function DashboardMemberList({
  members,
  userIdLabel,
  usernameLabel,
  roleLabel,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  updateLabel,
  deleteLabel,
  canManage,
  onRequestEdit,
  onRequestDelete,
}: DashboardMemberListProps) {
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

  if (members.length === 0) {
    return (
      <p className={cn("rounded-md border border-dashed border-slate-600 p-4 text-sm text-slate-400")}>{emptyLabel}</p>
    );
  }

  return (
    <>
      {members.map((member) => (
        <article
          key={member.userId}
          className={cn("flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/70 p-3")}
        >
          <div>
            <p className={cn("text-sm text-slate-200")}>
              {usernameLabel}: {member.userName ?? "-"}
            </p>
            <p className={cn("text-xs text-slate-400")}>
              {userIdLabel}: {member.userId}
            </p>
            <p className={cn("text-xs text-slate-400")}>
              {roleLabel}: {member.role}
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
              <DropdownMenuItem
                onSelect={() => canManage && onRequestEdit(member.userId, member.role)}
                disabled={!canManage}
              >
                <PencilLine className={cn("size-4")} />
                {updateLabel}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => canManage && onRequestDelete(member.userId)}
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
