import { Skeleton } from "@/components/ui/skeleton";
import { InvitationItem } from "@/features/invitation/components/InvitationItem/InvitationItem";
import type { InvitationItemData } from "@/features/invitation/components/types";
import { cn } from "@/lib/utils";

type InvitationListProps = {
  items: InvitationItemData[];
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  forbiddenLabel: string;
  errorLabel: string;
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

export function InvitationList({
  items,
  isLoading,
  isError,
  emptyLabel,
  forbiddenLabel,
  errorLabel,
  canManage,
  labels,
  onRevoke,
}: InvitationListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-2")}>
        <Skeleton className={cn("h-14 rounded-lg bg-[#1a2a51]")} />
        <Skeleton className={cn("h-14 rounded-lg bg-[#1a2a51]")} />
      </div>
    );
  }

  if (isError) {
    return (
      <p className={cn("rounded-lg border border-rose-400/40 bg-rose-950/30 p-3 text-xs text-rose-100")}>
        {errorLabel}
      </p>
    );
  }

  if (!canManage) {
    return (
      <p
        className={cn(
          "rounded-lg border border-dashed border-blue-300/30 bg-[#0b1737]/45 p-4 text-xs text-blue-100/70",
        )}
      >
        {forbiddenLabel}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "rounded-lg border border-dashed border-blue-300/30 bg-[#0b1737]/45 p-4 text-xs text-blue-100/70",
        )}
      >
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className={cn("space-y-2")}>
      {items.map((item) => (
        <InvitationItem key={item.invitationId} item={item} canManage={canManage} labels={labels} onRevoke={onRevoke} />
      ))}
    </div>
  );
}
