import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type HostItemMenuProps = {
  hostId: string;
  canManage: boolean;
  editLabel: string;
  deleteLabel: string;
  onEditHost: (hostId: string) => void;
  onDeleteHost: (hostId: string) => void;
};

export function HostItemMenu({
  hostId,
  canManage,
  editLabel,
  deleteLabel,
  onEditHost,
  onDeleteHost,
}: HostItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn(
            "h-11 w-11 cursor-pointer rounded-xl border-[#48618f] bg-[#223358]/70 text-blue-100/90 hover:bg-[#2b3f6d] disabled:cursor-not-allowed",
          )}
        >
          <MoreHorizontal className={cn("size-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("min-w-52 rounded-xl border-[#3e5687] bg-[#0d1a3a]/95 p-1 text-blue-50 backdrop-blur")}
      >
        <DropdownMenuItem
          className={cn("cursor-pointer disabled:cursor-not-allowed")}
          onSelect={() => canManage && onEditHost(hostId)}
          disabled={!canManage}
        >
          <PencilLine className={cn("size-4")} />
          {editLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer disabled:cursor-not-allowed")}
          variant="destructive"
          onSelect={() => canManage && onDeleteHost(hostId)}
          disabled={!canManage}
        >
          <Trash2 className={cn("size-4")} />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
