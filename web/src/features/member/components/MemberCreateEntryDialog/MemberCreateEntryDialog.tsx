import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type MemberCreateEntryDialogProps = {
  title: string;
  description: string;
  addByUserIdLabel: string;
  addByInvitationLabel: string;
  cancelLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectUserId: () => void;
  onSelectInvitation: () => void;
};

export function MemberCreateEntryDialog({
  title,
  description,
  addByUserIdLabel,
  addByInvitationLabel,
  cancelLabel,
  isOpen,
  onClose,
  onSelectUserId,
  onSelectInvitation,
}: MemberCreateEntryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{description}</DialogDescription>
        </DialogHeader>

        <div className={cn("grid gap-2")}>
          <Button
            type="button"
            variant="outline"
            onClick={onSelectUserId}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {addByUserIdLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSelectInvitation}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {addByInvitationLabel}
          </Button>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
