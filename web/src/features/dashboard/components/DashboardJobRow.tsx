// Responsibility: Render a selectable job row for recent jobs list.
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  projectLabel: string;
  workspaceLabel: string;
  hostLabel: string;
  tagsLabel: string;
  startedAtLabel: string;
  finishedAtLabel: string;
  durationLabel: string;
  statusLabels: Record<JobStatus, string>;
  canManage: boolean;
  deleteLabel: string;
  noPermissionLabel: string;
  isDeleting: boolean;
  isSelected: boolean;
  onSelectJob: (jobId: string) => void;
  onRequestDelete: (jobId: string) => void;
  onSelectPreviousJob: (jobId: string) => void;
  onSelectNextJob: (jobId: string) => void;
};

export default function DashboardJobRow({
  job,
  jobIdLabel,
  projectLabel,
  workspaceLabel,
  hostLabel,
  tagsLabel,
  startedAtLabel,
  finishedAtLabel,
  durationLabel,
  statusLabels,
  canManage,
  deleteLabel,
  noPermissionLabel,
  isDeleting,
  isSelected,
  onSelectJob,
  onRequestDelete,
  onSelectPreviousJob,
  onSelectNextJob,
}: DashboardJobRowProps) {
  const commandWithArgs = [job.command, ...job.args].join(" ").trim();

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border border-slate-700 bg-slate-800/80 p-3 text-left",
        isSelected ? "border-cyan-400/70 ring-1 ring-cyan-400/50" : "",
      )}
    >
      <div className={cn("flex items-start justify-between gap-3")}>
        <div className={cn("min-w-0 space-y-2")}>
          <Button
            type="button"
            variant="ghost"
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
              "h-auto w-full justify-start rounded-sm p-0 text-left hover:bg-transparent hover:text-cyan-100",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
          >
            <p className={cn("break-all font-mono text-base font-medium leading-6 text-slate-100")}>
              {commandWithArgs || "-"}
            </p>
          </Button>
          <div className={cn("flex flex-wrap items-center gap-2 text-sm text-slate-200")}>
            <MetaPill label={jobIdLabel} value={job.jobId} mono />
            <MetaPill label={workspaceLabel} value={job.workspace} />
            <MetaPill label={hostLabel} value={job.host} />
            <MetaPill label={projectLabel} value={job.project} />
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
            statusClassMap[job.status],
          )}
        >
          {statusLabels[job.status]}
        </span>
      </div>
      <div className={cn("space-y-2 text-sm text-slate-300")}>
        <div className={cn("flex flex-wrap items-center gap-2")}>
          <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>{tagsLabel}:</span>
          {job.tags.length > 0 ? (
            job.tags.map((tag) => (
              <span
                key={`${job.id}-tag-${tag}`}
                className={cn("rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2 py-0.5 text-cyan-100")}
              >
                {tag}
              </span>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
        <div className={cn("flex flex-wrap items-center gap-2")}>
          <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>
            {startedAtLabel}: {job.startedAt}
          </span>
          <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>
            {finishedAtLabel}: {job.finishedAt ?? "-"}
          </span>
          <span className={cn("rounded border border-slate-600 px-1.5 py-0.5")}>
            {durationLabel}: {job.duration}
          </span>
        </div>
      </div>
      <div className={cn("flex justify-end")}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRequestDelete(job.id)}
          disabled={!canManage || isDeleting}
          title={!canManage ? noPermissionLabel : undefined}
          className={cn(
            "border-rose-300/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-rose-100",
            !canManage ? "cursor-not-allowed opacity-60" : "",
          )}
        >
          <Trash2 className={cn("size-4")} />
          {deleteLabel}
        </Button>
      </div>
    </div>
  );
}

function MetaPill({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border border-slate-600 px-2 py-0.5 text-xs")}>
      <span className={cn("text-slate-400")}>{label}</span>
      <span className={cn("text-slate-200", mono ? "font-mono" : "")}>{value}</span>
    </span>
  );
}
