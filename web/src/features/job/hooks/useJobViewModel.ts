import { useMemo } from "react";
import type { JobListItem, JobStatusUi, JobViewState } from "@/features/job/components/types";
import type { JobResponse } from "@/generated/api";

type JobsQueryState = {
  data: JobResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

type UseJobViewModelParams = {
  workspaceId: string;
  jobsQuery: JobsQueryState;
  hostNameById: Map<string, string>;
  formatDateTime: (date: Date) => string;
};

const statusMap: Record<JobResponse["status"], JobStatusUi> = {
  running: "running",
  finished: "completed",
  failed: "failed",
  canceled: "canceled",
};

const toDurationLabel = (startedAt: string, finishedAt: string | null) => {
  const startedDate = new Date(startedAt);
  if (Number.isNaN(startedDate.getTime())) return "-";

  const endDate = finishedAt ? new Date(finishedAt) : new Date();
  if (Number.isNaN(endDate.getTime())) return "-";

  const diffMs = Math.max(0, endDate.getTime() - startedDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const useJobViewModel = ({ workspaceId, jobsQuery, hostNameById, formatDateTime }: UseJobViewModelParams) => {
  const jobs = useMemo<JobListItem[]>(() => {
    const payload = jobsQuery.data ?? [];
    return payload
      .map((job) => ({
        id: job.job_id,
        workspaceId: job.workspace_id,
        hostId: job.host_id,
        hostName: hostNameById.get(job.host_id) ?? job.host_id,
        startedAtIso: job.started_at,
        command: job.command,
        tags: job.tags ?? [],
        status: statusMap[job.status],
        startedAt: formatDateTime(new Date(job.started_at)),
        finishedAt: job.finished_at ? formatDateTime(new Date(job.finished_at)) : null,
        duration: toDurationLabel(job.started_at, job.finished_at ?? null),
        logs: job.tail_lines ?? [],
      }))
      .sort((a, b) => new Date(b.startedAtIso).getTime() - new Date(a.startedAtIso).getTime());
  }, [formatDateTime, hostNameById, jobsQuery.data]);

  const viewState: JobViewState = !workspaceId
    ? "empty"
    : jobsQuery.isLoading
      ? "loading"
      : jobsQuery.isError
        ? "error"
        : jobs.length === 0
          ? "empty"
          : "ready";

  return {
    jobs,
    viewState,
  };
};
