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
import type { MemberRoleOption } from "@/features/dashboard/components/DashboardMembersSection.types";
import { cn } from "@/lib/utils";

type DashboardMemberRoleDialogProps = {
  title: string;
  userIdLabel: string;
  roleLabel: string;
  updateLabel: string;
  cancelLabel: string;
  editingUserId: string | null;
  editingRole: string;
  roleOptions: MemberRoleOption[];
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEditingRoleChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DashboardMemberRoleDialog({
  title,
  userIdLabel,
  roleLabel,
  updateLabel,
  cancelLabel,
  editingUserId,
  editingRole,
  roleOptions,
  isSubmitting,
  isOpen,
  onClose,
  onEditingRoleChange,
  onSubmit,
}: DashboardMemberRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{updateLabel}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{title}</DialogDescription>
        </DialogHeader>
        <div className={cn("space-y-3")}>
          <p className={cn("text-sm text-slate-300")}>
            <span className={cn("text-slate-400")}>{userIdLabel}: </span>
            {editingUserId}
          </p>
          <Select value={editingRole} onValueChange={onEditingRoleChange}>
            <SelectTrigger className={cn("border-slate-600 bg-slate-800 text-slate-200")}>
              <SelectValue placeholder={roleLabel} />
            </SelectTrigger>
            <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
              {roleOptions.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
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
            disabled={!editingUserId || isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {updateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
