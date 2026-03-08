import { useMemo } from "react";
import type { InvitationItemData, InvitationStatus, InvitationViewState } from "@/features/invitation/components/types";
import type { WorkspaceInvitationResponse } from "@/generated/api";

type LookupUser = {
  user_id: string;
  name: string;
};

type UseInvitationViewModelParams = {
  invitations: WorkspaceInvitationResponse[] | undefined;
  users: LookupUser[] | undefined;
  isLoading: boolean;
  isError: boolean;
  formatDateTime: (date: Date) => string;
};

const getStatus = (usedAt: string | null | undefined, expiresAt: string): InvitationStatus => {
  if (usedAt) return "used";
  if (new Date(expiresAt).getTime() < Date.now()) return "expired";
  return "active";
};

export const useInvitationViewModel = ({
  invitations,
  users,
  isLoading,
  isError,
  formatDateTime,
}: UseInvitationViewModelParams) => {
  const userNameById = useMemo(() => {
    const userItems = users ?? [];
    return userItems.reduce<Record<string, string>>((acc, user) => {
      acc[user.user_id] = user.name;
      return acc;
    }, {});
  }, [users]);

  const items = useMemo<InvitationItemData[]>(() => {
    const invitationItems = invitations ?? [];
    return invitationItems.map((invitation) => ({
      invitationId: invitation.invitation_id,
      role: invitation.role,
      createdByName: userNameById[invitation.created_by_user_id] ?? "no name",
      createdByUserId: invitation.created_by_user_id,
      expiresAt: formatDateTime(new Date(invitation.expires_at)),
      status: getStatus(invitation.used_at, invitation.expires_at),
    }));
  }, [formatDateTime, invitations, userNameById]);

  const viewState: InvitationViewState = isLoading
    ? "loading"
    : isError
      ? "error"
      : items.length === 0
        ? "empty"
        : "ready";

  return {
    items,
    viewState,
  };
};
