// Responsibility: Derive filtered jobs and selected job state from current filters.
import { useCallback, useEffect, useMemo, useState } from "react";
import type { JobListItem } from "@/features/dashboard/types";

type UseDashboardSelectionParams = {
  jobs: JobListItem[];
  appliedQuery: string;
};

type UseDashboardSelectionResult = {
  filteredJobs: JobListItem[];
  selectedJob: JobListItem | null;
  selectedJobId: string | null;
  setSelectedJobId: (jobId: string) => void;
  selectPreviousJob: (fromJobId: string) => void;
  selectNextJob: (fromJobId: string) => void;
};

export const useDashboardSelection = ({
  jobs,
  appliedQuery,
}: UseDashboardSelectionParams): UseDashboardSelectionResult => {
  const [selectedJobId, setSelectedJobIdState] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    const normalizedKeyword = appliedQuery.trim().toLowerCase();
    if (!normalizedKeyword) return jobs;

    return jobs.filter((job) => {
      const searchable = `${job.title} ${job.workspace} ${job.host} ${job.status} ${job.command}`.toLowerCase();
      return searchable.includes(normalizedKeyword);
    });
  }, [appliedQuery, jobs]);

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJobIdState(null);
      return;
    }

    if (!selectedJobId || !filteredJobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobIdState(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) ?? null;

  const selectPreviousJob = useCallback(
    (fromJobId: string) => {
      const index = filteredJobs.findIndex((job) => job.id === fromJobId);
      if (index <= 0) return;
      setSelectedJobIdState(filteredJobs[index - 1].id);
    },
    [filteredJobs],
  );

  const selectNextJob = useCallback(
    (fromJobId: string) => {
      const index = filteredJobs.findIndex((job) => job.id === fromJobId);
      if (index < 0 || index >= filteredJobs.length - 1) return;
      setSelectedJobIdState(filteredJobs[index + 1].id);
    },
    [filteredJobs],
  );

  return {
    filteredJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId: setSelectedJobIdState,
    selectPreviousJob,
    selectNextJob,
  };
};
