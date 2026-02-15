// Responsibility: Render invitation link generation dialog and link copy action.
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

type DashboardMemberInviteDialogProps = {
  title: string;
  roleLabel: string;
  invitationLinkLabel: string;
  invitationLinkPlaceholder: string;
  generateInviteLabel: string;
  copyLinkLabel: string;
  cancelLabel: string;
  inviteRole: string;
  invitationUrl: string | null;
  roleOptions: MemberRoleOption[];
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onInviteRoleChange: (value: string) => void;
  onGenerateInvite: () => void;
  onCopyInvitationLink: () => void;
};

export default function DashboardMemberInviteDialog({
  title,
  roleLabel,
  invitationLinkLabel,
  invitationLinkPlaceholder,
  generateInviteLabel,
  copyLinkLabel,
  cancelLabel,
  inviteRole,
  invitationUrl,
  roleOptions,
  isSubmitting,
  isOpen,
  onClose,
  onInviteRoleChange,
  onGenerateInvite,
  onCopyInvitationLink,
}: DashboardMemberInviteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{generateInviteLabel}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{title}</DialogDescription>
        </DialogHeader>
        <div className={cn("space-y-3")}>
          <Select value={inviteRole} onValueChange={onInviteRoleChange}>
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
          <div className={cn("space-y-2")}>
            <p className={cn("text-xs text-slate-400")}>{invitationLinkLabel}</p>
            <Input
              value={invitationUrl ?? ""}
              readOnly
              placeholder={invitationLinkPlaceholder}
              className={cn("border-slate-600 bg-slate-800 text-slate-200")}
            />
          </div>
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
            variant="outline"
            onClick={onCopyInvitationLink}
            disabled={!invitationUrl}
            className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {copyLinkLabel}
          </Button>
          <Button
            type="button"
            onClick={onGenerateInvite}
            disabled={isSubmitting}
            className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {generateInviteLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
