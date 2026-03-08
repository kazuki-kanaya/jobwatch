import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type MemberDeleteDialogProps = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function MemberDeleteDialog({
  title,
  description,
  cancelLabel,
  confirmLabel,
  isSubmitting,
  isOpen,
  onClose,
  onConfirm,
}: MemberDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className={cn("text-slate-400")}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isSubmitting}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={onConfirm}
            className={cn("cursor-pointer bg-rose-700 text-white hover:bg-rose-600")}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
