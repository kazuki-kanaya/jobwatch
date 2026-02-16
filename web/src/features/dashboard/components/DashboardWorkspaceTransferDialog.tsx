// Responsibility: Render ownership transfer dialog for a workspace.
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
import type { DashboardSelectOption } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardWorkspaceTransferDialogProps = {
  title: string;
  newOwnerUserIdLabel: string;
  transferOwnerLabel: string;
  cancelLabel: string;
  transferOwnerUserId: string;
  transferOwnerOptions: DashboardSelectOption[];
  transferWorkspaceId: string | null;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onTransferOwnerUserIdChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DashboardWorkspaceTransferDialog({
  title,
  newOwnerUserIdLabel,
  transferOwnerLabel,
  cancelLabel,
  transferOwnerUserId,
  transferOwnerOptions,
  transferWorkspaceId,
  isSubmitting,
  isOpen,
  onClose,
  onTransferOwnerUserIdChange,
  onSubmit,
}: DashboardWorkspaceTransferDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{transferOwnerLabel}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{title}</DialogDescription>
        </DialogHeader>
        <div className={cn("space-y-3")}>
          <p className={cn("text-xs text-slate-400")}>{transferWorkspaceId}</p>
          <Select value={transferOwnerUserId} onValueChange={onTransferOwnerUserIdChange}>
            <SelectTrigger className={cn("border-slate-600 bg-slate-800 text-slate-200")}>
              <SelectValue placeholder={newOwnerUserIdLabel} />
            </SelectTrigger>
            <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
              {transferOwnerOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
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
            className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!transferOwnerUserId.trim() || isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {transferOwnerLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
