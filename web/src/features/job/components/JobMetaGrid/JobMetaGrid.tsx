import type { ReactNode } from "react";
import type { JobListItem } from "@/features/job/components/types";
import { cn } from "@/lib/utils";

type MetaRowProps = {
  label: string;
  value: ReactNode;
};

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className={cn("space-y-1")}>
      <p className={cn("text-[11px] font-semibold tracking-[0.08em] text-slate-400 uppercase")}>{label}</p>
      <p className={cn("break-all text-sm text-slate-100")}>{value}</p>
    </div>
  );
}

type JobMetaGridProps = {
  selectedJob: JobListItem;
  statusLabel: string;
  labels: {
    status: string;
    duration: string;
    startedAt: string;
    finishedAt: string;
    jobId: string;
    hostId: string;
    tags: string;
  };
};

export function JobMetaGrid({ selectedJob, statusLabel, labels }: JobMetaGridProps) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-2")}>
      <MetaRow label={labels.jobId} value={selectedJob.id} />
      <MetaRow label={labels.hostId} value={selectedJob.hostId} />
      <MetaRow label={labels.status} value={statusLabel} />
      <MetaRow label={labels.duration} value={selectedJob.duration} />
      <MetaRow label={labels.startedAt} value={selectedJob.startedAt} />
      <MetaRow label={labels.finishedAt} value={selectedJob.finishedAt ?? "-"} />
      <MetaRow label={labels.tags} value={selectedJob.tags.length > 0 ? selectedJob.tags.join(", ") : "-"} />
    </div>
  );
}
