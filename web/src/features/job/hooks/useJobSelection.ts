import { useEffect, useMemo, useState } from "react";
import type { JobListItem } from "@/features/job/components/types";

export const useJobSelection = (jobs: JobListItem[]) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (jobs.length === 0) {
      setSelectedJobId(null);
      return;
    }

    if (!selectedJobId || !jobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  return {
    selectedJobId,
    setSelectedJobId,
    selectedJob,
  };
};
