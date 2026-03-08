import type { CurrentUser } from "@/features/user";
import type { WorkspaceMemberResponse } from "@/generated/api";

type UseHostPermissionsParams = {
  currentUser: CurrentUser | null;
  members: WorkspaceMemberResponse[] | undefined;
};

export const useHostPermissions = ({ currentUser, members }: UseHostPermissionsParams) => {
  const currentMembershipRole =
    currentUser?.id && members ? (members.find((member) => member.user_id === currentUser.id)?.role ?? null) : null;

  const canManage = currentMembershipRole === "owner" || currentMembershipRole === "editor";

  return {
    canManage,
  };
};
