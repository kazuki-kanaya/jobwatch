import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type InvitationItemMenuProps = {
  invitationId: string;
  canManage: boolean;
  revokeLabel: string;
  onRevoke: (invitationId: string) => void;
};

export function InvitationItemMenu({ invitationId, canManage, revokeLabel, onRevoke }: InvitationItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn(
            "h-8 w-8 cursor-pointer rounded-lg border-slate-600/80 bg-slate-800/80 text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed",
          )}
        >
          <MoreHorizontal className={cn("size-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("rounded-xl border-slate-700 bg-slate-900/95 p-1 text-slate-100 backdrop-blur")}
      >
        <DropdownMenuItem
          className={cn("cursor-pointer disabled:cursor-not-allowed")}
          variant="destructive"
          onSelect={() => canManage && onRevoke(invitationId)}
          disabled={!canManage}
        >
          <Trash2 className={cn("size-4")} />
          {revokeLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
