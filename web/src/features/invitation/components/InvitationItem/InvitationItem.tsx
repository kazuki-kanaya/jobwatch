import { Badge } from "@/components/ui/badge";
import { InvitationItemMenu } from "@/features/invitation/components/InvitationItemMenu/InvitationItemMenu";
import type { InvitationItemData } from "@/features/invitation/components/types";
import { cn } from "@/lib/utils";

type InvitationItemProps = {
  item: InvitationItemData;
  canManage: boolean;
  labels: {
    createdBy: string;
    expiresAt: string;
    active: string;
    used: string;
    expired: string;
    revoke: string;
  };
  onRevoke: (invitationId: string) => void;
};

const statusClassName = {
  active: "border-cyan-400/40 bg-cyan-500/15 text-cyan-100",
  used: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  expired: "border-rose-400/40 bg-rose-500/15 text-rose-100",
} as const;

export function InvitationItem({ item, canManage, labels, onRevoke }: InvitationItemProps) {
  const statusLabel = item.status === "active" ? labels.active : item.status === "used" ? labels.used : labels.expired;

  return (
    <article
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-slate-700/70 bg-slate-900/35 px-3 py-2",
      )}
    >
      <div className={cn("min-w-0 space-y-1")}>
        <p className={cn("truncate font-mono text-xs text-slate-200")} title={item.invitationId}>
          {item.invitationId}
        </p>
        <div className={cn("flex flex-wrap items-center gap-2 text-xs text-slate-400")}>
          <Badge variant="outline" className={cn("h-5 border-slate-600/90 bg-slate-800/70 px-2 text-[10px] uppercase")}>
            {item.role}
          </Badge>
          <span>
            {labels.createdBy}: {item.createdByName}
          </span>
          <span>
            {labels.expiresAt}: {item.expiresAt}
          </span>
          <Badge variant="outline" className={cn("h-5 px-2 text-[10px] uppercase", statusClassName[item.status])}>
            {statusLabel}
          </Badge>
        </div>
      </div>
      <InvitationItemMenu
        invitationId={item.invitationId}
        canManage={canManage}
        revokeLabel={labels.revoke}
        onRevoke={onRevoke}
      />
    </article>
  );
}
