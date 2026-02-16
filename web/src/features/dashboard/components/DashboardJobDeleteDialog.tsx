// Responsibility: Render a confirmation dialog before deleting a job.
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

type DashboardJobDeleteDialogProps = {
  title: string;
  description: string;
  cancelLabel: string;
  deleteLabel: string;
  pendingDeleteJobId: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DashboardJobDeleteDialog({
  title,
  description,
  cancelLabel,
  deleteLabel,
  pendingDeleteJobId,
  isSubmitting,
  onCancel,
  onConfirm,
}: DashboardJobDeleteDialogProps) {
  return (
    <AlertDialog open={Boolean(pendingDeleteJobId)} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className={cn("text-slate-300")}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isSubmitting}
            className={cn("border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800")}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={onConfirm}
            className={cn("bg-rose-600 text-white hover:bg-rose-500")}
          >
            {deleteLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
