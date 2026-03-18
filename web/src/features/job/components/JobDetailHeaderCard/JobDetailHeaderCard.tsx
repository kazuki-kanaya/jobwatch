import type { JobListItem } from "@/features/job/components/types";
import { cn } from "@/lib/utils";

type JobDetailHeaderCardProps = {
  selectedJob: JobListItem;
  selectedJobLabel: string;
};

export function JobDetailHeaderCard({ selectedJob, selectedJobLabel }: JobDetailHeaderCardProps) {
  return (
    <div className={cn("rounded-xl border border-slate-700/80 bg-slate-950/40 p-3")}>
      <p className={cn("text-[11px] font-semibold tracking-[0.08em] text-slate-400 uppercase")}>{selectedJobLabel}</p>
      <p className={cn("mt-1 text-lg font-semibold text-slate-100")}>{selectedJob.command}</p>
      <p className={cn("mt-1 font-mono text-xs text-slate-300/80")}>{selectedJob.id}</p>
    </div>
  );
}
