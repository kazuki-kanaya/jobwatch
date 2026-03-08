import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type JobListItemMenuProps = {
  jobId: string;
  canManage: boolean;
  deleteLabel: string;
  onDeleteJob: (jobId: string) => void;
};

export function JobListItemMenu({ jobId, canManage, deleteLabel, onDeleteJob }: JobListItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn(
            "h-10 w-10 cursor-pointer rounded-lg border-slate-600 bg-slate-800/80 text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed",
          )}
        >
          <MoreHorizontal className={cn("size-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("min-w-40 rounded-xl border-slate-700 bg-slate-900 text-slate-100")}>
        <DropdownMenuItem
          variant="destructive"
          disabled={!canManage}
          onSelect={() => canManage && onDeleteJob(jobId)}
          className={cn("cursor-pointer disabled:cursor-not-allowed")}
        >
          <Trash2 className={cn("size-4")} />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
