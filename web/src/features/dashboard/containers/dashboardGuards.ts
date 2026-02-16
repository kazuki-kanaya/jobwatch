// Responsibility: Provide locale and role guard utilities for dashboard container wiring.

import type { DashboardMemberItem } from "@/features/dashboard/types";
import type { MembershipRole } from "@/generated/api";
import type { Locale } from "@/i18n/messages";

export const isLocale = (value: string): value is Locale => value === "en" || value === "ja";

export const isMembershipRole = (value: string): value is MembershipRole =>
  value === "owner" || value === "editor" || value === "viewer";

export const localeTagMap: Record<Locale, string> = {
  en: "en-US",
  ja: "ja-JP",
};

export const getCurrentMembershipRole = (
  members: DashboardMemberItem[],
  currentUserId: string | null,
): MembershipRole | null => {
  if (!currentUserId) return null;

  return members.find((member) => member.userId === currentUserId)?.role ?? null;
};

export const canManageHosts = (role: MembershipRole | null) => role === "owner" || role === "editor";
export const canManageJobs = canManageHosts;
export const canManageWorkspace = (role: MembershipRole | null) => role === "owner";
export const canManageMembers = canManageWorkspace;
