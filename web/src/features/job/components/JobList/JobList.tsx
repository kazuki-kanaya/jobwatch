import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { JobListItem } from "@/features/job/components/JobListItem/JobListItem";
import type { JobListItem as JobListItemType, JobStatusUi, JobViewState } from "@/features/job/components/types";
import { cn } from "@/lib/utils";

type JobListProps = {
  jobs: JobListItemType[];
  state: JobViewState;
  selectedJobId: string | null;
  emptyLabel: string;
  errorLabel: string;
  deleteLabel: string;
  canManage: boolean;
  hostLabel: string;
  startedAtLabel: string;
  durationLabel: string;
  statusLabels: Record<JobStatusUi, string>;
  onSelectJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
};

export function JobList({
  jobs,
  state,
  selectedJobId,
  emptyLabel,
  errorLabel,
  deleteLabel,
  canManage,
  hostLabel,
  startedAtLabel,
  durationLabel,
  statusLabels,
  onSelectJob,
  onDeleteJob,
}: JobListProps) {
  if (state === "loading") {
    return (
      <div className={cn("space-y-2")}>
        <Skeleton className={cn("h-20 bg-slate-800")} />
        <Skeleton className={cn("h-20 bg-slate-800")} />
        <Skeleton className={cn("h-20 bg-slate-800")} />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-rose-400/35 bg-rose-950/35 p-4 text-sm text-rose-100",
        )}
      >
        <AlertTriangle className={cn("size-4")} />
        {errorLabel}
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div
        className={cn("rounded-xl border border-dashed border-slate-600 bg-slate-900/45 p-5 text-sm text-slate-400")}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2")}>
      {jobs.map((job) => (
        <JobListItem
          key={job.id}
          job={job}
          isSelected={job.id === selectedJobId}
          canManage={canManage}
          deleteLabel={deleteLabel}
          hostLabel={hostLabel}
          statusLabel={statusLabels[job.status]}
          startedAtLabel={startedAtLabel}
          durationLabel={durationLabel}
          onSelect={onSelectJob}
          onDelete={onDeleteJob}
        />
      ))}
    </div>
  );
}
