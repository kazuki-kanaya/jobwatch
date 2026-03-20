import type { SnapshotMetrics } from "@/features/snapshot/components/types";
import { JobStatus } from "@/generated/api";

type SnapshotJob = {
  status: JobStatus;
};

export const EMPTY_SNAPSHOT: SnapshotMetrics = {
  tracked: 0,
  running: 0,
  completed: 0,
  canceled: 0,
  failed: 0,
};

export const buildSnapshotMetrics = (jobs: SnapshotJob[]): SnapshotMetrics =>
  jobs.reduce<SnapshotMetrics>(
    (acc, job) => {
      acc.tracked += 1;
      if (job.status === JobStatus.running) acc.running += 1;
      if (job.status === JobStatus.finished) acc.completed += 1;
      if (job.status === JobStatus.canceled) acc.canceled += 1;
      if (job.status === JobStatus.failed) acc.failed += 1;
      return acc;
    },
    { ...EMPTY_SNAPSHOT },
  );
