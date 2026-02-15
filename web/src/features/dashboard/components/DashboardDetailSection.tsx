// Responsibility: Render selected job details and latest logs in the right-side panel.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { JobListItem, JobStatus } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardDetailSectionProps = {
  title: string;
  selectedJobLabel: string;
  jobIdLabel: string;
  projectLabel: string;
  latestLogsLabel: string;
  commandLabel: string;
  argsLabel: string;
  tagsLabel: string;
  statusLabel: string;
  statusLabels: Record<JobStatus, string>;
  startedAtLabel: string;
  finishedAtLabel: string;
  durationLabel: string;
  errorLabel: string;
  emptyLabel: string;
  logsEmptyLabel: string;
  selectedJob: JobListItem | null;
};

export default function DashboardDetailSection({
  title,
  selectedJobLabel,
  jobIdLabel,
  projectLabel,
  latestLogsLabel,
  commandLabel,
  argsLabel,
  tagsLabel,
  statusLabel,
  statusLabels,
  startedAtLabel,
  finishedAtLabel,
  durationLabel,
  errorLabel,
  emptyLabel,
  logsEmptyLabel,
  selectedJob,
}: DashboardDetailSectionProps) {
  const commandWithArgs = selectedJob ? [selectedJob.command, ...selectedJob.args].join(" ").trim() : "";

  return (
    <Card className={cn("h-full border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("px-4")}>
        <CardTitle className={cn("text-sm font-semibold text-slate-200")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4 px-4")}>
        {!selectedJob ? <EmptyState label={emptyLabel} /> : null}
        {selectedJob ? (
          <>
            <section className={cn("space-y-2")}>
              <p className={cn("font-mono text-xs tracking-[0.14em] text-slate-500 uppercase")}>{selectedJobLabel}</p>
              <p className={cn("break-all font-medium text-slate-100")}>{commandWithArgs || "-"}</p>
              <div className={cn("space-y-1 text-sm text-slate-300")}>
                <DetailRow label={jobIdLabel} value={selectedJob.jobId} />
                <DetailRow label={projectLabel} value={selectedJob.project} />
                <DetailRow label={commandLabel} value={selectedJob.command} />
                <DetailRow label={argsLabel} value={selectedJob.args.join(" ") || "-"} />
                <DetailRow label={tagsLabel} value={selectedJob.tags.join(", ") || "-"} />
                <DetailRow label={statusLabel} value={statusLabels[selectedJob.status]} />
                <DetailRow label={startedAtLabel} value={selectedJob.startedAt} />
                <DetailRow label={finishedAtLabel} value={selectedJob.finishedAt ?? "-"} />
                <DetailRow label={durationLabel} value={selectedJob.duration} />
                <DetailRow label={errorLabel} value={selectedJob.errorMessage ?? "-"} />
              </div>
            </section>
            <Separator className={cn("bg-slate-700")} />
            <section className={cn("space-y-2")}>
              <p className={cn("font-mono text-xs tracking-[0.14em] text-slate-500 uppercase")}>{latestLogsLabel}</p>
              {selectedJob.tailLines.length === 0 ? (
                <p className={cn("text-sm text-slate-400")}>{logsEmptyLabel}</p>
              ) : (
                <ul
                  className={cn(
                    "space-y-1 rounded-md border border-slate-700 bg-slate-800/60 p-3 font-mono text-xs text-slate-300",
                  )}
                >
                  {selectedJob.tailLines.slice(-6).map((line) => (
                    <li key={`${selectedJob.id}-${line.slice(0, 30)}`}>{line}</li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className={cn("rounded-md border border-dashed border-slate-600 p-4 text-sm text-slate-400")}>{label}</p>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className={cn("text-slate-500")}>{label}:</span> {value}
    </p>
  );
}
