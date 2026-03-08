import { useAcceptInvitationInvitationsAcceptPost } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";

type UseInvitationAcceptMutationParams = {
  accessToken: string | undefined;
};

export const useInvitationAcceptMutation = ({ accessToken }: UseInvitationAcceptMutationParams) => {
  const mutation = useAcceptInvitationInvitationsAcceptPost({
    request: getAuthorizedRequestOptions(accessToken),
  });

  const acceptInvitation = async (token: string) => {
    return mutation.mutateAsync({ data: { token } });
  };

  return {
    acceptInvitation,
    isPending: mutation.isPending,
  };
};
