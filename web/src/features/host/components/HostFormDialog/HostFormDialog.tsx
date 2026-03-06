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

type HostFormDialogProps = {
  title: string;
  description: string;
  hostNameLabel: string;
  createLabel: string;
  updateLabel: string;
  cancelLabel: string;
  hostDraftName: string;
  isEditing: boolean;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onHostDraftNameChange: (value: string) => void;
  onSubmit: () => void;
};

export function HostFormDialog({
  title,
  description,
  hostNameLabel,
  createLabel,
  updateLabel,
  cancelLabel,
  hostDraftName,
  isEditing,
  isSubmitting,
  isOpen,
  onClose,
  onHostDraftNameChange,
  onSubmit,
}: HostFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{description}</DialogDescription>
        </DialogHeader>
        <Input
          value={hostDraftName}
          onChange={(event) => onHostDraftNameChange(event.target.value)}
          placeholder={hostNameLabel}
          className={cn("border-slate-600 bg-slate-800 text-slate-200")}
        />
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
            disabled={!hostDraftName.trim() || isSubmitting}
            className={cn("cursor-pointer bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed")}
          >
            {isEditing ? updateLabel : createLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
