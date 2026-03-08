import { useMemo } from "react";
import { useUserQueries } from "@/features/user/api/useUserQueries";
import type { CurrentUser } from "@/features/user/types";

type UseCurrentUserParams = {
  accessToken: string | undefined;
  enabled: boolean;
};

export const useCurrentUser = ({ accessToken, enabled }: UseCurrentUserParams) => {
  const { currentUserQuery } = useUserQueries({ accessToken, enabled });

  const currentUser = useMemo<CurrentUser | null>(() => {
    const data = currentUserQuery.data;
    if (!data) return null;

    return {
      id: data.user_id,
      name: data.name,
    };
  }, [currentUserQuery.data]);

  return {
    currentUser,
    currentUserQuery,
  };
};
