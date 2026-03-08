import { useQueryClient } from "@tanstack/react-query";
import { useDeleteJobWorkspacesWorkspaceIdJobsJobIdDelete } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { jobQueryKeys } from "./jobQueryKeys";

type UseJobMutationsParams = {
  accessToken: string | undefined;
  workspaceId: string;
};

export const useJobMutations = ({ accessToken, workspaceId }: UseJobMutationsParams) => {
  const queryClient = useQueryClient();
  const request = getAuthorizedRequestOptions(accessToken);
  const deleteMutation = useDeleteJobWorkspacesWorkspaceIdJobsJobIdDelete({ request });

  const deleteJob = async (jobId: string) => {
    if (!workspaceId) throw new Error("Workspace is not selected");

    await deleteMutation.mutateAsync({ workspaceId, jobId });
    await queryClient.invalidateQueries({ queryKey: jobQueryKeys.byWorkspace(workspaceId) });
  };

  return {
    deleteJob,
    isDeleting: deleteMutation.isPending,
  };
};
