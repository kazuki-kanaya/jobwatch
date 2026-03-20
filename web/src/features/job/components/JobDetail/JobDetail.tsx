import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    hostId: string;
    status: string;
    tags: string;
    startedAt: string;
    finishedAt: string;
    duration: string;
    latestLogs: string;
    viewFull: string;
  };
  statusLabel: string | null;
  logsEmptyLabel: string;
  copyLabel: string;
  copiedLabel: string;
};

type CopyTarget = "logs-modal";

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
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
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
    setIsLogsDialogOpen(false);
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

  const previewLogs = selectedJob ? selectedJob.logs.slice(-5) : [];
  const previewContent = previewLogs.length > 0 ? previewLogs.join("\n") : logsEmptyLabel;
  const fullLogs = selectedJob?.logs.join("\n") ?? "";

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
          <JobDetailHeaderCard selectedJob={selectedJob} selectedJobLabel={selectedJobLabel} />

          <JobMetaGrid
            selectedJob={selectedJob}
            statusLabel={statusLabel ?? "-"}
            labels={{
              status: labels.status,
              duration: labels.duration,
              startedAt: labels.startedAt,
              finishedAt: labels.finishedAt,
              jobId: labels.jobId,
              hostId: labels.hostId,
              tags: labels.tags,
            }}
          />

          <div className={cn("space-y-1")}>
            <div className={cn("flex items-center justify-between gap-3")}>
              <p className={cn("text-[11px] font-semibold tracking-[0.08em] text-slate-400 uppercase")}>
                {labels.latestLogs}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 cursor-pointer px-2 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
                )}
                onClick={() => setIsLogsDialogOpen(true)}
                disabled={selectedJob.logs.length === 0}
              >
                {labels.viewFull}
              </Button>
            </div>
            <div
              className={cn(
                "min-w-0 w-full max-w-full rounded-xl border border-slate-700/80 bg-slate-950/55 px-3 py-3",
              )}
            >
              <pre
                className={cn(
                  "max-h-32 min-w-0 max-w-full overflow-hidden whitespace-pre font-mono text-xs text-slate-200",
                )}
              >
                <code className={cn("block min-w-max")}>{previewContent}</code>
              </pre>
            </div>
          </div>

          <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
            <DialogContent
              className={cn(
                "min-w-0 w-full max-w-[calc(100vw-2rem)] border-slate-700 bg-slate-900 text-slate-100 sm:max-w-5xl",
              )}
            >
              <DialogHeader>
                <DialogTitle>{labels.latestLogs}</DialogTitle>
              </DialogHeader>
              <CopyableCodeBlock
                content={selectedJob.logs.length > 0 ? fullLogs : logsEmptyLabel}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                copied={copiedTarget === "logs-modal"}
                isCopyDisabled={selectedJob.logs.length === 0}
                onCopy={() => void handleCopy("logs-modal", fullLogs)}
                contentClassName={cn("max-h-[70vh]")}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </section>
  );
}
