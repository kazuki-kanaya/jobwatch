// Responsibility: Render member add dialog for user ID and role inputs.
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MemberRoleOption } from "@/features/dashboard/components/DashboardMembersSection.types";
import { cn } from "@/lib/utils";

type DashboardMemberAddDialogProps = {
  title: string;
  userIdLabel: string;
  roleLabel: string;
  addLabel: string;
  cancelLabel: string;
  draftUserId: string;
  draftRole: string;
  roleOptions: MemberRoleOption[];
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onDraftUserIdChange: (value: string) => void;
  onDraftRoleChange: (value: string) => void;
  onSubmit: () => void;
};

export default function DashboardMemberAddDialog({
  title,
  userIdLabel,
  roleLabel,
  addLabel,
  cancelLabel,
  draftUserId,
  draftRole,
  roleOptions,
  isSubmitting,
  isOpen,
  onClose,
  onDraftUserIdChange,
  onDraftRoleChange,
  onSubmit,
}: DashboardMemberAddDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{addLabel}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{title}</DialogDescription>
        </DialogHeader>
        <div className={cn("space-y-3")}>
          <Input
            value={draftUserId}
            onChange={(event) => onDraftUserIdChange(event.target.value)}
            placeholder={userIdLabel}
            className={cn("border-slate-600 bg-slate-800 text-slate-200")}
          />
          <Select value={draftRole} onValueChange={onDraftRoleChange}>
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
            disabled={!draftUserId.trim() || isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {addLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
