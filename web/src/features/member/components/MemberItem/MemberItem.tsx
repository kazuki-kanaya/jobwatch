import { UserRound } from "lucide-react";
import { MemberItemMenu } from "@/features/member/components/MemberItemMenu/MemberItemMenu";
import type { MemberItemData } from "@/features/member/components/types";
import { cn } from "@/lib/utils";

type MemberItemProps = {
  member: MemberItemData;
  canManage: boolean;
  userIdLabel: string;
  roleLabel: string;
  editLabel: string;
  deleteLabel: string;
  onEditMember: (userId: string) => void;
  onDeleteMember: (userId: string) => void;
};

export function MemberItem({
  member,
  canManage,
  userIdLabel,
  roleLabel,
  editLabel,
  deleteLabel,
  onEditMember,
  onDeleteMember,
}: MemberItemProps) {
  return (
    <article className={cn("flex items-center justify-between gap-3 px-4 py-2.5")}>
      <div className={cn("min-w-0 space-y-0.5")}>
        <p className={cn("flex min-w-0 items-center gap-1.5")}>
          <span
            className={cn(
              "inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
            )}
          >
            <UserRound className={cn("size-2.5")} />
          </span>
          <span className={cn("truncate text-sm font-semibold text-slate-100")}>{member.userName}</span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-400/45 bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.05em] text-cyan-100 uppercase",
            )}
            title={roleLabel}
          >
            {member.role}
          </span>
        </p>
        <p
          className={cn("truncate pl-6.5 font-mono text-[11px] text-slate-400/65")}
          title={`${userIdLabel}: ${member.userId}`}
        >
          {member.userId}
        </p>
      </div>
      <div className={cn("flex shrink-0 items-center gap-1.5")}>
        <MemberItemMenu
          userId={member.userId}
          canManage={canManage}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
        />
      </div>
    </article>
  );
}
