// Responsibility: Render host create/update dialog with name input.
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardHostFormDialogProps = {
  title: string;
  hostNameLabel: string;
  addLabel: string;
  updateLabel: string;
  cancelLabel: string;
  draftName: string;
  isEditing: boolean;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onDraftNameChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DashboardHostFormDialog({
  title,
  hostNameLabel,
  addLabel,
  updateLabel,
  cancelLabel,
  draftName,
  isEditing,
  isSubmitting,
  isOpen,
  onClose,
  onDraftNameChange,
  onSubmit,
}: DashboardHostFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{isEditing ? updateLabel : addLabel}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{title}</DialogDescription>
        </DialogHeader>
        <Input
          value={draftName}
          onChange={(event) => onDraftNameChange(event.target.value)}
          placeholder={hostNameLabel}
          className={cn("border-slate-600 bg-slate-800 text-slate-200")}
        />
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
            disabled={!draftName.trim() || isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {isEditing ? updateLabel : addLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
