import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardProfileEditDialogProps = {
  title: string;
  nameLabel: string;
  updateLabel: string;
  cancelLabel: string;
  isOpen: boolean;
  draftName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onDraftNameChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DashboardProfileEditDialog({
  title,
  nameLabel,
  updateLabel,
  cancelLabel,
  isOpen,
  draftName,
  isSubmitting,
  onClose,
  onDraftNameChange,
  onSubmit,
}: DashboardProfileEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={cn("space-y-2")}>
          <p className={cn("text-sm text-slate-300")}>{nameLabel}</p>
          <Input
            value={draftName}
            onChange={(event) => onDraftNameChange(event.target.value)}
            className={cn("border-slate-600 bg-slate-800 text-slate-100")}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {updateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
