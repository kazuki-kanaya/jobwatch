import type { CurrentUser } from "@/features/user";
import type { WorkspaceMemberResponse } from "@/generated/api";

type UseWorkspacePermissionsParams = {
  currentUser: CurrentUser | null;
  members: WorkspaceMemberResponse[] | undefined;
};

export const useWorkspacePermissions = ({ currentUser, members }: UseWorkspacePermissionsParams) => {
  const currentMembershipRole =
    currentUser?.id && members ? (members.find((member) => member.user_id === currentUser.id)?.role ?? null) : null;

  const canManage = currentMembershipRole === "owner";

  return {
    canManage,
  };
};
