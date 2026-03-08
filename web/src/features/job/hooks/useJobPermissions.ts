import type { CurrentUser } from "@/features/user";
import type { WorkspaceMemberResponse } from "@/generated/api";

type UseJobPermissionsParams = {
  currentUser: CurrentUser | null;
  members: WorkspaceMemberResponse[] | undefined;
};

export const useJobPermissions = ({ currentUser, members }: UseJobPermissionsParams) => {
  const currentMembershipRole =
    currentUser?.id && members ? (members.find((member) => member.user_id === currentUser.id)?.role ?? null) : null;

  const canManage = currentMembershipRole === "owner" || currentMembershipRole === "editor";

  return {
    canManage,
  };
};
