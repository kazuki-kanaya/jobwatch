import { useState } from "react";
import { toast } from "sonner";
import { useDashboardJobMutations } from "@/features/dashboard/api/dashboardJobMutations";
import type { DashboardViewModel } from "@/features/dashboard/types";

type UseDashboardJobCrudParams = {
  accessToken: string | undefined;
  workspaceId: string;
  texts: Pick<DashboardViewModel["texts"], "jobDeleted" | "jobCrudError">;
};

type UseDashboardJobCrudResult = {
  pendingDeleteJobId: string | null;
  isJobSubmitting: boolean;
  requestDeleteJob: (jobId: string) => void;
  cancelDeleteJob: () => void;
  confirmDeleteJob: () => Promise<void>;
};

export const useDashboardJobCrud = ({
  accessToken,
  workspaceId,
  texts,
}: UseDashboardJobCrudParams): UseDashboardJobCrudResult => {
  const [pendingDeleteJobId, setPendingDeleteJobId] = useState<string | null>(null);
  const jobMutations = useDashboardJobMutations({ accessToken, workspaceId });

  return {
    pendingDeleteJobId,
    isJobSubmitting: jobMutations.isDeleting,
    requestDeleteJob: (jobId) => setPendingDeleteJobId(jobId),
    cancelDeleteJob: () => setPendingDeleteJobId(null),
    confirmDeleteJob: async () => {
      if (!pendingDeleteJobId) return;

      try {
        await jobMutations.deleteJob(pendingDeleteJobId);
        toast.success(texts.jobDeleted);
      } catch (error) {
        console.error(error);
        toast.error(texts.jobCrudError);
      } finally {
        setPendingDeleteJobId(null);
      }
    },
  };
};
