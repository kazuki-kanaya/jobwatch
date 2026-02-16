// Responsibility: Provide job deletion mutation with dashboard-scoped cache invalidation.
import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import { useDeleteJobWorkspacesWorkspaceIdJobsJobIdDelete } from "@/generated/api";

type UseDashboardJobMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

const getAuthorizedFetchOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } satisfies RequestInit;
};

export const useDashboardJobMutations = ({ accessToken, workspaceId }: UseDashboardJobMutationsParams) => {
  const queryClient = useQueryClient();
  const fetch = getAuthorizedFetchOptions(accessToken);
  const deleteMutation = useDeleteJobWorkspacesWorkspaceIdJobsJobIdDelete({ fetch });

  const deleteJob = async (jobId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    const response = await deleteMutation.mutateAsync({ workspaceId, jobId });
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.jobs(workspaceId) });
    await queryClient.invalidateQueries({ queryKey: ["dashboard", "jobs", "host", workspaceId] });

    if (response.status !== 204) {
      throw new Error("Failed to delete job");
    }
  };

  return {
    deleteJob,
    isDeleting: deleteMutation.isPending,
  };
};
