import { useMemo } from "react";
import type { MemberItemData, MemberViewState } from "@/features/member/components/types";
import type { WorkspaceMemberResponse } from "@/generated/api";

type LookupUser = {
  user_id: string;
  name: string;
};

type UseMemberViewModelParams = {
  members: WorkspaceMemberResponse[] | undefined;
  users: LookupUser[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const useMemberViewModel = ({ members, users, isLoading, isError }: UseMemberViewModelParams) => {
  const userNameById = useMemo(() => {
    const userItems = users ?? [];
    return userItems.reduce<Record<string, string>>((acc, user) => {
      acc[user.user_id] = user.name;
      return acc;
    }, {});
  }, [users]);

  const items = useMemo<MemberItemData[]>(() => {
    const memberItems = members ?? [];
    return memberItems.map((member) => ({
      userId: member.user_id,
      userName: userNameById[member.user_id] ?? "no name",
      role: member.role,
    }));
  }, [members, userNameById]);

  const viewState: MemberViewState = isLoading ? "loading" : isError ? "error" : items.length === 0 ? "empty" : "ready";

  return {
    items,
    viewState,
  };
};
