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
import type { MembershipRole } from "@/generated/api";
import { cn } from "@/lib/utils";

type RoleOption = {
  id: MembershipRole;
  name: string;
};

type MemberRoleDialogProps = {
  title: string;
  description: string;
  userIdLabel: string;
  roleLabel: string;
  updateLabel: string;
  cancelLabel: string;
  editingUserId: string | null;
  editingRole: MembershipRole;
  roleOptions: readonly RoleOption[];
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEditingRoleChange: (value: MembershipRole) => void;
  onSubmit: () => void;
};

export function MemberRoleDialog({
  title,
  description,
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
}: MemberRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{description}</DialogDescription>
        </DialogHeader>
        <div className={cn("space-y-3")}>
          <p className={cn("text-sm text-slate-300")}>
            <span className={cn("text-slate-400")}>{userIdLabel}: </span>
            {editingUserId}
          </p>
          <Select value={editingRole} onValueChange={(value) => onEditingRoleChange(value as MembershipRole)}>
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
            disabled={isSubmitting}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!editingUserId || isSubmitting}
            className={cn("cursor-pointer bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {updateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
