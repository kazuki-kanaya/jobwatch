import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type MemberItemMenuProps = {
  userId: string;
  canManage: boolean;
  editLabel: string;
  deleteLabel: string;
  onEditMember: (userId: string) => void;
  onDeleteMember: (userId: string) => void;
};

export function MemberItemMenu({
  userId,
  canManage,
  editLabel,
  deleteLabel,
  onEditMember,
  onDeleteMember,
}: MemberItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn(
            "h-9 w-9 cursor-pointer rounded-lg border-slate-600/80 bg-slate-800/80 text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed",
          )}
        >
          <MoreHorizontal className={cn("size-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("min-w-48 rounded-xl border-slate-700 bg-slate-900/95 p-1 text-slate-100 backdrop-blur")}
      >
        <DropdownMenuItem
          className={cn("cursor-pointer disabled:cursor-not-allowed")}
          onSelect={() => canManage && onEditMember(userId)}
          disabled={!canManage}
        >
          <PencilLine className={cn("size-4")} />
          {editLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer disabled:cursor-not-allowed")}
          variant="destructive"
          onSelect={() => canManage && onDeleteMember(userId)}
          disabled={!canManage}
        >
          <Trash2 className={cn("size-4")} />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
