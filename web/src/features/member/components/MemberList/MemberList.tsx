import { Skeleton } from "@/components/ui/skeleton";
import { MemberItem } from "@/features/member/components/MemberItem/MemberItem";
import type { MemberItemData } from "@/features/member/components/types";
import { cn } from "@/lib/utils";

type MemberListProps = {
  items: MemberItemData[];
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  userIdLabel: string;
  roleLabel: string;
  editLabel: string;
  deleteLabel: string;
  canManage: boolean;
  onEditMember: (userId: string) => void;
  onDeleteMember: (userId: string) => void;
};

export function MemberList({
  items,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  userIdLabel,
  roleLabel,
  editLabel,
  deleteLabel,
  canManage,
  onEditMember,
  onDeleteMember,
}: MemberListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3")}>
        <Skeleton className={cn("h-16 rounded-xl bg-[#1a2a51]")} />
        <Skeleton className={cn("h-16 rounded-xl bg-[#1a2a51]")} />
      </div>
    );
  }

  if (isError) {
    return (
      <p className={cn("rounded-xl border border-rose-400/40 bg-rose-950/30 p-4 text-sm text-rose-100")}>
        {errorLabel}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "rounded-xl border border-dashed border-blue-300/30 bg-[#0b1737]/45 p-5 text-sm text-blue-100/70",
        )}
      >
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-700/70 bg-slate-900/35")}>
      <div className={cn("divide-y divide-slate-800/70")}>
        {items.map((member) => (
          <MemberItem
            key={member.userId}
            member={member}
            canManage={canManage}
            userIdLabel={userIdLabel}
            roleLabel={roleLabel}
            editLabel={editLabel}
            deleteLabel={deleteLabel}
            onEditMember={onEditMember}
            onDeleteMember={onDeleteMember}
          />
        ))}
      </div>
    </div>
  );
}
