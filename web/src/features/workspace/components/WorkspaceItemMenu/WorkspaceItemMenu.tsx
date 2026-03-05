import { MoreHorizontal, PencilLine, Trash2, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type WorkspaceItemMenuProps = {
  workspaceId: string;
  canManage: boolean;
  editLabel: string;
  transferOwnerLabel: string;
  deleteLabel: string;
  onEditWorkspace: (workspaceId: string) => void;
  onTransferWorkspaceOwner: (workspaceId: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
};

export function WorkspaceItemMenu({
  workspaceId,
  canManage,
  editLabel,
  transferOwnerLabel,
  deleteLabel,
  onEditWorkspace,
  onTransferWorkspaceOwner,
  onDeleteWorkspace,
}: WorkspaceItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn("h-11 w-11 rounded-xl border-[#48618f] bg-[#223358]/70 text-blue-100/90 hover:bg-[#2b3f6d]")}
        >
          <MoreHorizontal className={cn("size-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("min-w-52 rounded-xl border-[#3e5687] bg-[#0d1a3a]/95 p-1 text-blue-50 backdrop-blur")}
      >
        <DropdownMenuItem onSelect={() => canManage && onEditWorkspace(workspaceId)} disabled={!canManage}>
          <PencilLine className={cn("size-4")} />
          {editLabel}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => canManage && onTransferWorkspaceOwner(workspaceId)} disabled={!canManage}>
          <UserRoundCog className={cn("size-4")} />
          {transferOwnerLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => canManage && onDeleteWorkspace(workspaceId)}
          disabled={!canManage}
        >
          <Trash2 className={cn("size-4")} />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
