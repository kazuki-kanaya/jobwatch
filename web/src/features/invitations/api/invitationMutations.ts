// Responsibility: Provide invitation accept mutation through Orval with auth headers.
import { useAcceptInvitationInvitationsAcceptPost } from "@/generated/api";

type UseInvitationAcceptMutationParams = {
  accessToken: string | undefined;
};

const getAuthorizedFetchOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } satisfies RequestInit;
};

export const useInvitationAcceptMutation = ({ accessToken }: UseInvitationAcceptMutationParams) => {
  const mutation = useAcceptInvitationInvitationsAcceptPost({
    fetch: getAuthorizedFetchOptions(accessToken),
  });

  const acceptInvitation = async (token: string) => {
    const response = await mutation.mutateAsync({ data: { token } });
    if (response.status !== 200) throw new Error("Failed to accept invitation");

    return response.data;
  };

  return {
    acceptInvitation,
    isPending: mutation.isPending,
  };
};
