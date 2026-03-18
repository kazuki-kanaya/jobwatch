import { AlertCircle, CheckCircle2, Clock3, OctagonX } from "lucide-react";
import { JobListItemMenu } from "@/features/job/components/JobListItemMenu/JobListItemMenu";
import type { JobListItem as JobItem, JobStatusUi } from "@/features/job/components/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<JobStatusUi, { icon: typeof Clock3; badgeClass: string }> = {
  running: { icon: Clock3, badgeClass: "border-cyan-300/35 bg-cyan-500/20 text-cyan-100" },
  completed: { icon: CheckCircle2, badgeClass: "border-emerald-300/35 bg-emerald-500/20 text-emerald-100" },
  failed: { icon: AlertCircle, badgeClass: "border-rose-300/35 bg-rose-500/20 text-rose-100" },
  canceled: { icon: OctagonX, badgeClass: "border-amber-300/35 bg-amber-500/20 text-amber-100" },
};

type JobListItemProps = {
  job: JobItem;
  isSelected: boolean;
  canManage: boolean;
  deleteLabel: string;
  statusLabel: string;
  startedAtLabel: string;
  durationLabel: string;
  onSelect: (jobId: string) => void;
  onDelete: (jobId: string) => void;
};

export function JobListItem({
  job,
  isSelected,
  canManage,
  deleteLabel,
  statusLabel,
  startedAtLabel,
  durationLabel,
  onSelect,
  onDelete,
}: JobListItemProps) {
  const config = statusConfig[job.status];
  const StatusIcon = config.icon;

  return (
    <article
      className={cn(
        "group rounded-xl border p-3 transition",
        isSelected
          ? "border-cyan-300/65 bg-cyan-500/12 shadow-[inset_3px_0_0_0_rgba(34,211,238,0.7)]"
          : "border-slate-700 bg-slate-900/55 hover:border-slate-600 hover:bg-slate-900/70",
      )}
    >
      <div className={cn("flex items-start justify-between gap-3")}>
        <button
          type="button"
          onClick={() => onSelect(job.id)}
          className={cn("min-w-0 flex-1 cursor-pointer text-left")}
        >
          <div className={cn("flex items-center gap-2")}>
            <p className={cn("truncate text-base font-semibold text-slate-100")}>{job.command}</p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                config.badgeClass,
              )}
            >
              <StatusIcon className={cn("size-3.5")} />
              {statusLabel}
            </span>
          </div>
          <div className={cn("mt-1 space-y-1")}>
            <p className={cn("truncate font-mono text-xs text-slate-300/80")}>{job.id}</p>
            <p className={cn("truncate font-mono text-xs text-slate-300/70")} title={job.command}>
              {job.command}
            </p>
            <p className={cn("truncate text-xs text-slate-400")}>
              {startedAtLabel}: {job.startedAt} / {durationLabel}: {job.duration}
            </p>
          </div>
        </button>
        <JobListItemMenu jobId={job.id} canManage={canManage} deleteLabel={deleteLabel} onDeleteJob={onDelete} />
      </div>
    </article>
  );
}
