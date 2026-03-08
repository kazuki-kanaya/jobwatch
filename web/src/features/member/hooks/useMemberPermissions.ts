import type { CurrentUser } from "@/features/user";
import type { WorkspaceMemberResponse } from "@/generated/api";

type UseMemberPermissionsParams = {
  currentUser: CurrentUser | null;
  members: WorkspaceMemberResponse[] | undefined;
};

export const useMemberPermissions = ({ currentUser, members }: UseMemberPermissionsParams) => {
  const currentMembershipRole =
    currentUser?.id && members ? (members.find((member) => member.user_id === currentUser.id)?.role ?? null) : null;

  const canManage = currentMembershipRole === "owner" || currentMembershipRole === "editor";

  return {
    canManage,
  };
};
