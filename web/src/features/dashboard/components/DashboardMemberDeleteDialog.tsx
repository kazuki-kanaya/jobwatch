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

type DashboardMemberDeleteDialogProps = {
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  cancelLabel: string;
  deleteLabel: string;
  pendingDeleteUserId: string | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

export default function DashboardMemberDeleteDialog({
  deleteConfirmTitle,
  deleteConfirmDescription,
  cancelLabel,
  deleteLabel,
  pendingDeleteUserId,
  onCancelDelete,
  onConfirmDelete,
}: DashboardMemberDeleteDialogProps) {
  return (
    <AlertDialog open={Boolean(pendingDeleteUserId)}>
      <AlertDialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription className={cn("text-slate-400")}>{deleteConfirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancelDelete}
            className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className={cn("bg-rose-600 text-white hover:bg-rose-500")}>
            {deleteLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
