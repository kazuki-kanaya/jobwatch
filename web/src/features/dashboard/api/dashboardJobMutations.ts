import { useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import { useDeleteJobWorkspacesWorkspaceIdJobsJobIdDelete } from "@/generated/api";

type UseDashboardJobMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

const getAuthorizedRequestOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const useDashboardJobMutations = ({ accessToken, workspaceId }: UseDashboardJobMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const deleteMutation = useDeleteJobWorkspacesWorkspaceIdJobsJobIdDelete({ request });

  const deleteJob = async (jobId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    await deleteMutation.mutateAsync({ workspaceId, jobId });
    await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.jobs(workspaceId) });
    await queryClient.invalidateQueries({ queryKey: ["dashboard", "jobs", "host", workspaceId] });
  };

  return {
    deleteJob,
    isDeleting: deleteMutation.isPending,
  };
};
