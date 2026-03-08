import type { MembershipRole } from "@/generated/api";

export type InvitationStatus = "active" | "used" | "expired";

export type InvitationItemData = {
  invitationId: string;
  role: MembershipRole;
  createdByName: string;
  createdByUserId: string;
  expiresAt: string;
  status: InvitationStatus;
};

export type InvitationViewState = "loading" | "ready" | "empty" | "error";
