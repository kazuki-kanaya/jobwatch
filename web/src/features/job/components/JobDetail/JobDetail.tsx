import { useEffect, useRef, useState } from "react";
import { CopyableCodeBlock } from "@/features/job/components/CopyableCodeBlock/CopyableCodeBlock";
import { JobDetailHeaderCard } from "@/features/job/components/JobDetailHeaderCard/JobDetailHeaderCard";
import { JobMetaGrid } from "@/features/job/components/JobMetaGrid/JobMetaGrid";
import type { JobListItem } from "@/features/job/components/types";
import { cn } from "@/lib/utils";

type JobDetailProps = {
  selectedJob: JobListItem | null;
  title: string;
  selectedJobLabel: string;
  emptyLabel: string;
  labels: {
    jobId: string;
    project: string;
    status: string;
    command: string;
    args: string;
    tags: string;
    startedAt: string;
    finishedAt: string;
    duration: string;
    latestLogs: string;
    error: string;
  };
  statusLabel: string | null;
  logsEmptyLabel: string;
  copyLabel: string;
  copiedLabel: string;
};

type CopyTarget = "error" | "logs";

export function JobDetail({
  selectedJob,
  title,
  selectedJobLabel,
  emptyLabel,
  labels,
  statusLabel,
  logsEmptyLabel,
  copyLabel,
  copiedLabel,
}: JobDetailProps) {
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const selectedJobId = selectedJob?.id ?? null;
  const previousSelectedJobIdRef = useRef<string | null>(selectedJobId);

  useEffect(() => {
    if (!copiedTarget) return;
    const timer = window.setTimeout(() => setCopiedTarget(null), 1200);
    return () => window.clearTimeout(timer);
  }, [copiedTarget]);

  useEffect(() => {
    if (previousSelectedJobIdRef.current === selectedJobId) return;
    previousSelectedJobIdRef.current = selectedJobId;
    setCopiedTarget(null);
  }, [selectedJobId]);

  const handleCopy = async (target: CopyTarget, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={cn("min-w-0 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4")}>
      <p className={cn("text-lg font-semibold text-slate-100")}>{title}</p>
      {!selectedJob ? (
        <div
          className={cn(
            "mt-4 rounded-xl border border-dashed border-slate-600 bg-slate-900/55 p-4 text-sm text-slate-400",
          )}
        >
          {emptyLabel}
        </div>
      ) : (
        <div className={cn("mt-4 space-y-4")}>
          <JobDetailHeaderCard
            selectedJob={selectedJob}
            selectedJobLabel={selectedJobLabel}
            commandLabel={labels.command}
          />

          <JobMetaGrid
            selectedJob={selectedJob}
            statusLabel={statusLabel ?? "-"}
            labels={{
              project: labels.project,
              status: labels.status,
              duration: labels.duration,
              startedAt: labels.startedAt,
              finishedAt: labels.finishedAt,
              command: labels.command,
              jobId: labels.jobId,
              args: labels.args,
              tags: labels.tags,
            }}
          />

          <div className={cn("space-y-1")}>
            <p className={cn("text-[11px] font-semibold tracking-[0.08em] text-slate-400 uppercase")}>{labels.error}</p>
            {selectedJob.errorMessage ? (
              <CopyableCodeBlock
                content={selectedJob.errorMessage}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                copied={copiedTarget === "error"}
                onCopy={() => void handleCopy("error", selectedJob.errorMessage ?? "")}
              />
            ) : (
              <p className={cn("break-all text-sm text-slate-100")}>-</p>
            )}
          </div>

          <div className={cn("space-y-1")}>
            <p className={cn("text-[11px] font-semibold tracking-[0.08em] text-slate-400 uppercase")}>
              {labels.latestLogs}
            </p>
            <CopyableCodeBlock
              content={selectedJob.logs.length > 0 ? selectedJob.logs.join("\n") : logsEmptyLabel}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              copied={copiedTarget === "logs"}
              isCopyDisabled={selectedJob.logs.length === 0}
              onCopy={() => void handleCopy("logs", selectedJob.logs.join("\n"))}
            />
          </div>
        </div>
      )}
    </section>
  );
}
