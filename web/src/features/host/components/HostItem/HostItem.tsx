import { Activity, Ban, CheckCircle2, CircleAlert, TimerReset } from "lucide-react";
import { HostItemMenu } from "@/features/host/components/HostItemMenu/HostItemMenu";
import type { HostItemData } from "@/features/host/components/types";
import { cn } from "@/lib/utils";

type HostItemProps = {
  host: HostItemData;
  canManage: boolean;
  editLabel: string;
  deleteLabel: string;
  snapshotLabels: {
    tracked: string;
    running: string;
    completed: string;
    canceled: string;
    failed: string;
    unavailable: string;
  };
  onEditHost: (hostId: string) => void;
  onDeleteHost: (hostId: string) => void;
};

export function HostItem({
  host,
  canManage,
  editLabel,
  deleteLabel,
  snapshotLabels,
  onEditHost,
  onDeleteHost,
}: HostItemProps) {
  const snapshotItems = [
    {
      key: "tracked",
      label: snapshotLabels.tracked,
      value: host.snapshot.tracked,
      icon: Activity,
      className: "text-slate-100/85",
      chipClassName: "border-white/8 bg-slate-950/14",
    },
    {
      key: "running",
      label: snapshotLabels.running,
      value: host.snapshot.running,
      icon: TimerReset,
      className: "text-cyan-200/90",
      chipClassName: "border-cyan-400/20 bg-cyan-500/8",
    },
    {
      key: "completed",
      label: snapshotLabels.completed,
      value: host.snapshot.completed,
      icon: CheckCircle2,
      className: "text-emerald-200/90",
      chipClassName: "border-emerald-400/20 bg-emerald-500/8",
    },
    {
      key: "canceled",
      label: snapshotLabels.canceled,
      value: host.snapshot.canceled,
      icon: Ban,
      className: "text-amber-200/90",
      chipClassName: "border-amber-400/20 bg-amber-500/8",
    },
    {
      key: "failed",
      label: snapshotLabels.failed,
      value: host.snapshot.failed,
      icon: CircleAlert,
      className: "text-rose-200/90",
      chipClassName: "border-rose-400/20 bg-rose-500/8",
    },
  ] as const;

  return (
    <article
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-[#304a79] bg-[#1a2849]/65 px-4 py-3.5 transition-colors hover:border-[#4668a6] hover:bg-[#1d2d54] xl:grid xl:grid-cols-[minmax(220px,1fr)_auto] xl:items-start xl:gap-x-4 xl:gap-y-2",
      )}
    >
      <div className={cn("min-w-0 flex-1 space-y-1")}>
        <div className={cn("min-w-0 space-y-1")}>
          <p className={cn("truncate text-base font-semibold text-slate-100/90")}>{host.name}</p>
          <p className={cn("truncate font-mono text-sm text-blue-100/55")} title={host.id}>
            {host.id}
          </p>
        </div>
      </div>
      <div className={cn("flex items-center justify-between gap-3 xl:shrink-0")}>
        {host.snapshotState === "loading" ? (
          <div className={cn("flex min-w-0 flex-wrap gap-2 pt-0.5 xl:max-w-[720px] xl:justify-end")}>
            {snapshotItems.map((item) => (
              <div
                key={item.key}
                className={cn("flex h-8 w-[90px] items-center rounded-full border px-3", item.chipClassName)}
              >
                <div className={cn("h-3 w-10 rounded bg-white/8")} />
              </div>
            ))}
          </div>
        ) : host.snapshotState === "error" ? (
          <div className={cn("flex min-w-0 flex-wrap gap-2 pt-0.5 xl:max-w-[720px] xl:justify-end")}>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-500/8 px-2.5 py-1 text-xs font-medium",
              )}
            >
              <CircleAlert className={cn("size-3.5 text-rose-200/90")} />
              <span className={cn("text-rose-100/85")}>{snapshotLabels.unavailable}</span>
            </span>
          </div>
        ) : (
          <div className={cn("flex min-w-0 flex-wrap gap-2 pt-0.5 xl:max-w-[720px] xl:justify-end")}>
            {snapshotItems.map((item) => (
              <span
                key={item.key}
                className={cn(
                  "inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  item.chipClassName,
                )}
              >
                <item.icon className={cn("size-3.5", item.className)} />
                <span className={cn("text-slate-300/72")}>{item.label}</span>
                <span className={cn("font-semibold tabular-nums", item.className)}>{item.value}</span>
              </span>
            ))}
          </div>
        )}
        <HostItemMenu
          hostId={host.id}
          canManage={canManage}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          onEditHost={onEditHost}
          onDeleteHost={onDeleteHost}
        />
      </div>
    </article>
  );
}
