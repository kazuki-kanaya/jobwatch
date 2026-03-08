import { Copy } from "lucide-react";
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

type InvitationCreateDialogProps = {
  title: string;
  description: string;
  roleLabel: string;
  generateLabel: string;
  invitationLinkLabel: string;
  invitationLinkPlaceholder: string;
  copyLabel: string;
  cancelLabel: string;
  draftRole: MembershipRole;
  roleOptions: readonly RoleOption[];
  invitationUrl: string | null;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onDraftRoleChange: (value: MembershipRole) => void;
  onGenerate: () => void;
  onCopy: () => void;
};

export function InvitationCreateDialog({
  title,
  description,
  roleLabel,
  generateLabel,
  invitationLinkLabel,
  invitationLinkPlaceholder,
  copyLabel,
  cancelLabel,
  draftRole,
  roleOptions,
  invitationUrl,
  isSubmitting,
  isOpen,
  onClose,
  onDraftRoleChange,
  onGenerate,
  onCopy,
}: InvitationCreateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{description}</DialogDescription>
        </DialogHeader>

        <div className={cn("space-y-3")}>
          <Select value={draftRole} onValueChange={(value) => onDraftRoleChange(value as MembershipRole)}>
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

          <div className={cn("space-y-1.5")}>
            <p className={cn("text-xs text-slate-400")}>{invitationLinkLabel}</p>
            <div
              className={cn(
                "grid min-h-11 items-center rounded-md border border-slate-700 bg-slate-950/65 px-3 py-2 text-sm",
                invitationUrl ? "text-slate-100" : "text-slate-500",
              )}
            >
              <p
                className={cn("w-full break-all font-mono leading-5")}
                title={invitationUrl ?? invitationLinkPlaceholder}
              >
                {invitationUrl ?? invitationLinkPlaceholder}
              </p>
            </div>
          </div>
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
            variant="outline"
            onClick={onCopy}
            disabled={!invitationUrl || isSubmitting}
            className={cn(
              "cursor-pointer border-cyan-400/40 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500",
            )}
          >
            <Copy className={cn("size-4")} />
            {copyLabel}
          </Button>
          <Button
            type="button"
            onClick={onGenerate}
            disabled={isSubmitting}
            className={cn("cursor-pointer bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          >
            {generateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
