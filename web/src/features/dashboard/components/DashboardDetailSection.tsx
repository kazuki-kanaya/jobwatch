import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  isLoading: boolean;
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
  isLoading,
  selectedJob,
}: DashboardDetailSectionProps) {
  const commandWithArgs = selectedJob ? [selectedJob.command, ...selectedJob.args].join(" ").trim() : "";

  return (
    <Card className={cn("h-full border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("px-4")}>
        <CardTitle className={cn("text-base font-semibold text-slate-100")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4 px-4")}>
        {isLoading ? (
          <div className={cn("space-y-3")}>
            <Skeleton className={cn("h-28 bg-slate-800")} />
            <Skeleton className={cn("h-36 bg-slate-800")} />
            <Skeleton className={cn("h-32 bg-slate-800")} />
          </div>
        ) : null}
        {!isLoading && !selectedJob ? <EmptyState label={emptyLabel} /> : null}
        {!isLoading && selectedJob ? (
          <>
            <section className={cn("space-y-3")}>
              <p className={cn("font-mono text-sm tracking-[0.12em] text-slate-400 uppercase")}>{selectedJobLabel}</p>
              <p
                className={cn(
                  "break-all rounded-md border border-slate-700 bg-slate-800/70 p-3 font-mono text-base text-slate-100",
                )}
              >
                {commandWithArgs || "-"}
              </p>
              <div className={cn("space-y-2 text-sm text-slate-200")}>
                <DetailRow label={jobIdLabel} value={selectedJob.jobId} mono />
                <DetailRow label={projectLabel} value={selectedJob.project} />
                <DetailRow label={commandLabel} value={selectedJob.command} mono />
                <DetailRow label={argsLabel} value={selectedJob.args.join(" ") || "-"} mono />
                <DetailRow label={tagsLabel} value={selectedJob.tags.join(", ") || "-"} />
                <DetailRow label={statusLabel} value={statusLabels[selectedJob.status]} />
                <DetailRow label={startedAtLabel} value={selectedJob.startedAt} />
                <DetailRow label={finishedAtLabel} value={selectedJob.finishedAt ?? "-"} />
                <DetailRow label={durationLabel} value={selectedJob.duration} />
                <DetailRow label={errorLabel} value={selectedJob.errorMessage ?? "-"} />
              </div>
            </section>
            <Separator className={cn("bg-slate-700")} />
            <section className={cn("space-y-3")}>
              <p className={cn("font-mono text-sm tracking-[0.12em] text-slate-400 uppercase")}>{latestLogsLabel}</p>
              {selectedJob.tailLines.length === 0 ? (
                <p className={cn("text-sm text-slate-400")}>{logsEmptyLabel}</p>
              ) : (
                <ul
                  className={cn(
                    "space-y-1 rounded-md border border-slate-700 bg-slate-800/60 p-3 font-mono text-sm text-slate-200",
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

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      className={cn("grid grid-cols-[120px_1fr] gap-3 rounded-md border border-slate-700/70 bg-slate-800/40 px-3 py-2")}
    >
      <span className={cn("text-sm text-slate-400")}>{label}</span>
      <span className={cn("break-all text-sm text-slate-100", mono ? "font-mono" : "")}>{value}</span>
    </div>
  );
}
