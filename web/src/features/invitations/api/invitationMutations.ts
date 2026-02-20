import { useAcceptInvitationInvitationsAcceptPost } from "@/generated/api";

type UseInvitationAcceptMutationParams = {
  accessToken: string | undefined;
};

const getAuthorizedRequestOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const useInvitationAcceptMutation = ({ accessToken }: UseInvitationAcceptMutationParams) => {
  const mutation = useAcceptInvitationInvitationsAcceptPost({
    request: getAuthorizedRequestOptions(accessToken),
  });

  const acceptInvitation = async (token: string) => {
    const response = await mutation.mutateAsync({ data: { token } });
    return response;
  };

  return {
    acceptInvitation,
    isPending: mutation.isPending,
  };
};
