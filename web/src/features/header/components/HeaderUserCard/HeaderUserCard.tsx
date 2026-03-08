import { Fingerprint, PenLine, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderUserCardProps = {
  currentUserLabel: string;
  currentUserName: string;
  currentUserId: string;
  editProfileLabel: string;
  onEditProfile: () => void;
};

export function HeaderUserCard({
  currentUserLabel,
  currentUserName,
  currentUserId,
  editProfileLabel,
  onEditProfile,
}: HeaderUserCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[380px] rounded-md border border-cyan-300/28 bg-cyan-500/8 px-3 py-2",
        "shadow-[inset_0_0_0_1px_rgba(34,211,238,0.08)]",
      )}
    >
      <div className={cn("mb-1 flex items-center justify-between gap-2")}>
        <span className={cn("text-xs font-semibold tracking-wide text-cyan-100 uppercase")}>{currentUserLabel}</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onEditProfile}
          className={cn("h-6 cursor-pointer px-2 text-xs text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-50")}
        >
          <PenLine className={cn("size-3.5")} />
          {editProfileLabel}
        </Button>
      </div>
      <div className={cn("flex flex-col gap-2.5")}>
        <div className={cn("flex items-center gap-1.5 text-base text-slate-50")}>
          <UserRound className={cn("size-4 text-cyan-200")} />
          <span className={cn("font-semibold leading-none")}>{currentUserName}</span>
        </div>
        <div className={cn("flex items-center gap-1.5 text-xs text-slate-300")}>
          <Fingerprint className={cn("size-3.5 text-slate-300")} />
          <span className={cn("leading-none")}>{currentUserId}</span>
        </div>
      </div>
    </div>
  );
}
