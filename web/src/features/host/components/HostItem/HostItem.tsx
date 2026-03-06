import { HostItemMenu } from "@/features/host/components/HostItemMenu/HostItemMenu";
import type { HostItemData } from "@/features/host/components/types";
import { cn } from "@/lib/utils";

type HostItemProps = {
  host: HostItemData;
  canManage: boolean;
  editLabel: string;
  deleteLabel: string;
  onEditHost: (hostId: string) => void;
  onDeleteHost: (hostId: string) => void;
};

export function HostItem({ host, canManage, editLabel, deleteLabel, onEditHost, onDeleteHost }: HostItemProps) {
  return (
    <article
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl border border-[#304a79] bg-[#1a2849]/65 px-4 py-3.5 transition-colors hover:border-[#4668a6] hover:bg-[#1d2d54]",
      )}
    >
      <div className={cn("min-w-0 space-y-1")}>
        <p className={cn("truncate text-base font-semibold text-slate-100/90")}>{host.name}</p>
        <p className={cn("truncate font-mono text-sm text-blue-100/55")} title={host.id}>
          {host.id}
        </p>
      </div>
      <HostItemMenu
        hostId={host.id}
        canManage={canManage}
        editLabel={editLabel}
        deleteLabel={deleteLabel}
        onEditHost={onEditHost}
        onDeleteHost={onDeleteHost}
      />
    </article>
  );
}
