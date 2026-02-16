import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardJobDeleteDialog from "@/features/dashboard/components/DashboardJobDeleteDialog";
import DashboardJobRow from "@/features/dashboard/components/DashboardJobRow";
import type { JobListItem, JobStatus } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type JobsUiState = "ready" | "loading" | "empty" | "error";

type DashboardJobsSectionProps = {
  jobs: JobListItem[];
  uiState: JobsUiState;
  title: string;
  emptyLabel: string;
  errorLabel: string;
  jobIdLabel: string;
  projectLabel: string;
  workspaceLabel: string;
  hostLabel: string;
  tagsLabel: string;
  startedAtLabel: string;
  finishedAtLabel: string;
  durationLabel: string;
  cancelLabel: string;
  deleteLabel: string;
  noPermissionLabel: string;
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  canManage: boolean;
  pendingDeleteJobId: string | null;
  isSubmittingDelete: boolean;
  statusLabels: Record<JobStatus, string>;
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onRequestDelete: (jobId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onSelectPreviousJob: (jobId: string) => void;
  onSelectNextJob: (jobId: string) => void;
};

export default function DashboardJobsSection({
  jobs,
  uiState,
  title,
  emptyLabel,
  errorLabel,
  jobIdLabel,
  projectLabel,
  workspaceLabel,
  hostLabel,
  tagsLabel,
  startedAtLabel,
  finishedAtLabel,
  durationLabel,
  cancelLabel,
  deleteLabel,
  noPermissionLabel,
  deleteConfirmTitle,
  deleteConfirmDescription,
  canManage,
  pendingDeleteJobId,
  isSubmittingDelete,
  statusLabels,
  selectedJobId,
  onSelectJob,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onSelectPreviousJob,
  onSelectNextJob,
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
        {uiState === "ready"
          ? jobs.map((job) => (
              <DashboardJobRow
                key={job.id}
                job={job}
                jobIdLabel={jobIdLabel}
                projectLabel={projectLabel}
                workspaceLabel={workspaceLabel}
                hostLabel={hostLabel}
                tagsLabel={tagsLabel}
                startedAtLabel={startedAtLabel}
                finishedAtLabel={finishedAtLabel}
                durationLabel={durationLabel}
                canManage={canManage}
                deleteLabel={deleteLabel}
                noPermissionLabel={noPermissionLabel}
                isDeleting={isSubmittingDelete}
                statusLabels={statusLabels}
                isSelected={job.id === selectedJobId}
                onSelectJob={onSelectJob}
                onRequestDelete={onRequestDelete}
                onSelectPreviousJob={onSelectPreviousJob}
                onSelectNextJob={onSelectNextJob}
              />
            ))
          : null}
        <DashboardJobDeleteDialog
          title={deleteConfirmTitle}
          description={deleteConfirmDescription}
          cancelLabel={cancelLabel}
          deleteLabel={deleteLabel}
          pendingDeleteJobId={pendingDeleteJobId}
          isSubmitting={isSubmittingDelete}
          onCancel={onCancelDelete}
          onConfirm={onConfirmDelete}
        />
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
