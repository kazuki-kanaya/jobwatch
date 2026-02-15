// Responsibility: Render job list area with ready/empty/loading/error visual states.
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobListItem, JobStatus } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type JobsUiState = "ready" | "loading" | "empty" | "error";

type DashboardJobsSectionProps = {
  jobs: JobListItem[];
  uiState: JobsUiState;
  title: string;
  emptyLabel: string;
  errorLabel: string;
  statusLabels: Record<JobStatus, string>;
};

const statusClassMap: Record<JobStatus, string> = {
  running: "bg-cyan-400/20 text-cyan-200 border-cyan-300/40",
  completed: "bg-emerald-400/20 text-emerald-200 border-emerald-300/40",
  failed: "bg-rose-400/20 text-rose-200 border-rose-300/40",
  queued: "bg-amber-400/20 text-amber-200 border-amber-300/40",
};

export default function DashboardJobsSection({
  jobs,
  uiState,
  title,
  emptyLabel,
  errorLabel,
  statusLabels,
}: DashboardJobsSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("px-4")}>
        <CardTitle className={cn("text-sm font-semibold text-slate-200")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-3 px-4")}>
        {uiState === "loading" ? <LoadingRows /> : null}
        {uiState === "error" ? <ErrorRow label={errorLabel} /> : null}
        {uiState === "empty" ? <EmptyRow label={emptyLabel} /> : null}
        {uiState === "ready" ? jobs.map((job) => <JobRow key={job.id} job={job} statusLabels={statusLabels} />) : null}
      </CardContent>
    </Card>
  );
}

function LoadingRows() {
  const skeletonKeys = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

  return (
    <div className={cn("space-y-2")}>
      {skeletonKeys.map((key) => (
        <Skeleton key={key} className={cn("h-16 rounded-lg bg-slate-800")} />
      ))}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className={cn("rounded-lg border border-dashed border-slate-600 bg-slate-800/60 p-5 text-sm text-slate-400")}>
      {label}
    </div>
  );
}

function ErrorRow({ label }: { label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-rose-400/40 bg-rose-950/40 p-4 text-sm text-rose-200",
      )}
    >
      <AlertTriangle className={cn("size-4")} />
      {label}
    </div>
  );
}

function JobRow({ job, statusLabels }: { job: JobListItem; statusLabels: Record<JobStatus, string> }) {
  return (
    <article
      className={cn(
        "grid gap-2 rounded-lg border border-slate-700 bg-slate-800/80 p-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center",
      )}
    >
      <div>
        <h3 className={cn("font-medium text-slate-100")}>{job.title}</h3>
        <p className={cn("font-mono text-xs text-slate-400")}>{job.startedAt}</p>
      </div>
      <p className={cn("text-sm text-slate-300")}>{job.workspace}</p>
      <p className={cn("text-sm text-slate-300")}>{job.host}</p>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium capitalize",
          statusClassMap[job.status],
        )}
      >
        {statusLabels[job.status]}
      </span>
    </article>
  );
}
