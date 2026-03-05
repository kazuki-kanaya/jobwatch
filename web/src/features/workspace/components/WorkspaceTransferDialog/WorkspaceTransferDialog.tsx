import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WorkspaceOwnerOption } from "@/features/workspace/components/types";
import { cn } from "@/lib/utils";

type WorkspaceTransferDialogProps = {
  title: string;
  description: string;
  ownerUserIdLabel: string;
  transferLabel: string;
  cancelLabel: string;
  workspaceId: string | null;
  ownerUserId: string;
  ownerOptions: WorkspaceOwnerOption[];
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOwnerUserIdChange: (value: string) => void;
  onSubmit: () => void;
};

export function WorkspaceTransferDialog({
  title,
  description,
  ownerUserIdLabel,
  transferLabel,
  cancelLabel,
  workspaceId,
  ownerUserId,
  ownerOptions,
  isSubmitting,
  isOpen,
  onClose,
  onOwnerUserIdChange,
  onSubmit,
}: WorkspaceTransferDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{description}</DialogDescription>
        </DialogHeader>
        <div className={cn("space-y-3")}>
          {workspaceId ? <p className={cn("text-xs text-slate-400")}>{workspaceId}</p> : null}
          <Select value={ownerUserId} onValueChange={onOwnerUserIdChange}>
            <SelectTrigger className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200")}>
              <SelectValue placeholder={ownerUserIdLabel} />
            </SelectTrigger>
            <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
              {ownerOptions.map((option) => (
                <SelectItem key={option.id} value={option.id} className={cn("cursor-pointer")}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!ownerUserId.trim() || isSubmitting}
            className={cn("cursor-pointer bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed")}
          >
            {transferLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
