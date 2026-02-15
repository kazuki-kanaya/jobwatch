// Responsibility: Render a selectable job row for recent jobs list.
import type { JobListItem, JobStatus } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const statusClassMap: Record<JobStatus, string> = {
  running: "bg-cyan-400/20 text-cyan-200 border-cyan-300/40",
  completed: "bg-emerald-400/20 text-emerald-200 border-emerald-300/40",
  failed: "bg-rose-400/20 text-rose-200 border-rose-300/40",
  queued: "bg-amber-400/20 text-amber-200 border-amber-300/40",
};

type DashboardJobRowProps = {
  job: JobListItem;
  jobIdLabel: string;
  commandLabel: string;
  argsLabel: string;
  tagsLabel: string;
  startedAtLabel: string;
  finishedAtLabel: string;
  durationLabel: string;
  statusLabels: Record<JobStatus, string>;
  isSelected: boolean;
  onSelectJob: (jobId: string) => void;
  onSelectPreviousJob: (jobId: string) => void;
  onSelectNextJob: (jobId: string) => void;
};

export default function DashboardJobRow({
  job,
  jobIdLabel,
  commandLabel,
  argsLabel,
  tagsLabel,
  startedAtLabel,
  finishedAtLabel,
  durationLabel,
  statusLabels,
  isSelected,
  onSelectJob,
  onSelectPreviousJob,
  onSelectNextJob,
}: DashboardJobRowProps) {
  const commandWithArgs = [job.command, ...job.args].join(" ").trim();

  return (
    <button
      type="button"
      onClick={() => onSelectJob(job.id)}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          onSelectPreviousJob(job.id);
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          onSelectNextJob(job.id);
        }
      }}
      className={cn(
        "space-y-2 rounded-lg border border-slate-700 bg-slate-800/80 p-3 text-left",
        "hover:border-cyan-400/50 hover:bg-slate-800",
        isSelected ? "border-cyan-400/70 ring-1 ring-cyan-400/50" : "",
      )}
    >
      <div className={cn("flex items-start justify-between gap-2")}>
        <div className={cn("space-y-1")}>
          <h3
            className={cn("truncate text-base font-medium text-slate-100")}
            title={`${commandLabel}: ${commandWithArgs || "-"}`}
          >
            {commandWithArgs || "-"}
          </h3>
          <p className={cn("truncate text-sm text-slate-300")}>{job.project}</p>
          <p className={cn("shrink-0 font-mono text-sm text-slate-500")}>
            {jobIdLabel}: {job.jobId}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full border px-2.5 py-1 text-sm font-medium capitalize",
            statusClassMap[job.status],
          )}
        >
          {statusLabels[job.status]}
        </span>
      </div>
      <div className={cn("flex flex-wrap items-center gap-2 text-sm text-slate-300")}>
        <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>
          {argsLabel}: {job.args.length}
        </span>
        <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>
          {tagsLabel}: {job.tags.length}
        </span>
        <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>
          {durationLabel}: {job.duration}
        </span>
        <span>
          {startedAtLabel}: {job.startedAt}
        </span>
        <span>
          {finishedAtLabel}: {job.finishedAt ?? "-"}
        </span>
        <span className={cn("truncate")}>{job.workspace}</span>
        <span className={cn("truncate")}>@ {job.host}</span>
      </div>
    </button>
  );
}
