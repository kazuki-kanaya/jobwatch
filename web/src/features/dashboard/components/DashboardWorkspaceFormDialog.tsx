// Responsibility: Render workspace create/update form dialog.
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

type DashboardWorkspaceFormDialogProps = {
  title: string;
  workspaceNameLabel: string;
  addLabel: string;
  updateLabel: string;
  cancelLabel: string;
  workspaceDraftName: string;
  isEditing: boolean;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onDraftNameChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DashboardWorkspaceFormDialog({
  title,
  workspaceNameLabel,
  addLabel,
  updateLabel,
  cancelLabel,
  workspaceDraftName,
  isEditing,
  isSubmitting,
  isOpen,
  onClose,
  onDraftNameChange,
  onSubmit,
}: DashboardWorkspaceFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{isEditing ? updateLabel : addLabel}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{title}</DialogDescription>
        </DialogHeader>
        <Input
          value={workspaceDraftName}
          onChange={(event) => onDraftNameChange(event.target.value)}
          placeholder={workspaceNameLabel}
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
            disabled={!workspaceDraftName.trim() || isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {isEditing ? updateLabel : addLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
