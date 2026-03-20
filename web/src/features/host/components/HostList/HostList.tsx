import { Skeleton } from "@/components/ui/skeleton";
import { HostItem } from "@/features/host/components/HostItem/HostItem";
import type { HostItemData } from "@/features/host/components/types";
import { cn } from "@/lib/utils";

type HostListProps = {
  items: HostItemData[];
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
  errorLabel: string;
  editLabel: string;
  deleteLabel: string;
  snapshotLabels: {
    tracked: string;
    running: string;
    completed: string;
    canceled: string;
    failed: string;
  };
  canManage: boolean;
  onEditHost: (hostId: string) => void;
  onDeleteHost: (hostId: string) => void;
};

export function HostList({
  items,
  isLoading,
  isError,
  emptyLabel,
  errorLabel,
  editLabel,
  deleteLabel,
  snapshotLabels,
  canManage,
  onEditHost,
  onDeleteHost,
}: HostListProps) {
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
    <div className={cn("space-y-3")}>
      {items.map((host) => (
        <HostItem
          key={host.id}
          host={host}
          canManage={canManage}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          snapshotLabels={snapshotLabels}
          onEditHost={onEditHost}
          onDeleteHost={onDeleteHost}
        />
      ))}
    </div>
  );
}
