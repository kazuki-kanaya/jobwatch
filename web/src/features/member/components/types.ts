import type { MembershipRole } from "@/generated/api";

export type MemberItemData = {
  userId: string;
  userName: string;
  role: MembershipRole;
};

export type MemberViewState = "loading" | "ready" | "empty" | "error";
