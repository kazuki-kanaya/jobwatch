import { useMemo } from "react";
import {
  useDashboardCurrentUserQuery,
  useDashboardHostsQuery,
  useDashboardInvitationsQuery,
  useDashboardJobsByHostQuery,
  useDashboardJobsQuery,
  useDashboardMembersQuery,
  useDashboardUsersLookupQuery,
  useDashboardWorkspacesQuery,
} from "@/features/dashboard/api/dashboardQueries";
import { canManageWorkspace } from "@/features/dashboard/containers/dashboardGuards";
import { ALL_FILTER_ID } from "@/features/dashboard/containers/hooks/constants";
import {
  toCurrentUser,
  toHostOptions,
  toInvitationItems,
  toJobListItems,
  toMemberItems,
  toWorkspaceOptions,
} from "@/features/dashboard/lib/mappers";
import type {
  DashboardCurrentUser,
  DashboardHostItem,
  DashboardInvitationItem,
  DashboardMemberItem,
  DashboardSelectOption,
  JobListItem,
} from "@/features/dashboard/types";

type UseDashboardDataParams = {
  accessToken: string | undefined;
  canRequest: boolean;
  isAuthLoading: boolean;
  workspaceId: string;
  hostId: string;
  localeTag: string;
  allLabel: string;
};

type UseDashboardDataResult = {
  workspaces: DashboardSelectOption[];
  currentUser: DashboardCurrentUser | null;
  invitations: DashboardInvitationItem[];
  hosts: DashboardHostItem[];
  members: DashboardMemberItem[];
  hostOptions: DashboardSelectOption[];
  activeWorkspaceId: string;
  selectedHostId: string;
  jobs: JobListItem[];
  isLoading: boolean;
  isError: boolean;
  isWorkspacesLoading: boolean;
  isWorkspacesError: boolean;
  isInvitationsLoading: boolean;
  isInvitationsError: boolean;
  isHostsLoading: boolean;
  isHostsError: boolean;
  isMembersLoading: boolean;
  isMembersError: boolean;
  isJobsLoading: boolean;
  isJobsError: boolean;
};

export const useDashboardData = ({
  accessToken,
  canRequest,
  isAuthLoading,
  workspaceId,
  hostId,
  localeTag,
  allLabel,
}: UseDashboardDataParams): UseDashboardDataResult => {
  const currentUserQuery = useDashboardCurrentUserQuery(accessToken, canRequest && !isAuthLoading);
  const currentUser = useMemo(() => toCurrentUser(currentUserQuery.data), [currentUserQuery.data]);

  const workspaceQuery = useDashboardWorkspacesQuery(accessToken, canRequest && !isAuthLoading);
  const workspaces = useMemo(() => toWorkspaceOptions(workspaceQuery.data), [workspaceQuery.data]);

  const activeWorkspaceId = workspaceId || workspaces[0]?.id || "";

  const hostsQuery = useDashboardHostsQuery(activeWorkspaceId || null, accessToken, canRequest);
  const hostPayload = Array.isArray(hostsQuery.data) ? hostsQuery.data : undefined;

  const hostOptions = useMemo(() => {
    const mappedHosts = toHostOptions(hostPayload);
    return [{ id: ALL_FILTER_ID, name: allLabel }, ...mappedHosts];
  }, [allLabel, hostPayload]);
  const hosts = useMemo(() => toHostOptions(hostPayload), [hostPayload]);

  const membersQuery = useDashboardMembersQuery(activeWorkspaceId || null, accessToken, canRequest);
  const memberPayload = membersQuery.data;
  const currentMembershipRole =
    currentUser?.userId && memberPayload
      ? (memberPayload.members.find((member) => member.user_id === currentUser.userId)?.role ?? null)
      : null;
  const canManageWorkspaceByRole = canManageWorkspace(currentMembershipRole);

  const invitationsQuery = useDashboardInvitationsQuery(
    activeWorkspaceId || null,
    accessToken,
    canRequest && canManageWorkspaceByRole,
  );
  const invitationsPayload = invitationsQuery.data;

  const lookupUserIds = useMemo(() => {
    const ids = new Set<string>();
    memberPayload?.members.forEach((member) => {
      ids.add(member.user_id);
    });
    invitationsPayload?.invitations.forEach((invitation) => {
      ids.add(invitation.created_by_user_id);
    });
    if (currentUser) ids.add(currentUser.userId);
    return [...ids];
  }, [currentUser, invitationsPayload, memberPayload]);
  const usersLookupQuery = useDashboardUsersLookupQuery(lookupUserIds, accessToken, canRequest);
  const userNameById = useMemo(() => {
    const users = usersLookupQuery.data?.users ?? [];
    const map = new Map(users.map((user) => [user.user_id, user.name]));
    if (currentUser) map.set(currentUser.userId, currentUser.name);
    return map;
  }, [currentUser, usersLookupQuery.data]);

  const members = useMemo(() => {
    const mappedMembers = toMemberItems(memberPayload);
    return mappedMembers.map((member) => {
      const userName =
        member.userName ??
        userNameById.get(member.userId) ??
        (currentUser?.userId === member.userId ? currentUser.name : null);
      return { ...member, userName };
    });
  }, [currentUser, memberPayload, userNameById]);

  const invitations = useMemo(
    () => toInvitationItems(invitationsPayload, localeTag, userNameById),
    [invitationsPayload, localeTag, userNameById],
  );

  const selectedHostId = hostOptions.some((host) => host.id === hostId) ? hostId : ALL_FILTER_ID;
  const activeHostId = selectedHostId === ALL_FILTER_ID ? null : selectedHostId;
  const activeWorkspaceName = workspaces.find((workspace) => workspace.id === activeWorkspaceId)?.name ?? allLabel;
  const hostNameById = useMemo(() => new Map(hosts.map((host) => [host.id, host.name])), [hosts]);

  const jobsWorkspaceQuery = useDashboardJobsQuery(activeWorkspaceId || null, accessToken, canRequest && !activeHostId);
  const jobsByHostQuery = useDashboardJobsByHostQuery(activeWorkspaceId || null, activeHostId, accessToken, canRequest);

  const workspaceJobsPayload = Array.isArray(jobsWorkspaceQuery.data) ? jobsWorkspaceQuery.data : undefined;
  const hostJobsPayload = Array.isArray(jobsByHostQuery.data) ? jobsByHostQuery.data : undefined;
  const jobsPayload = activeHostId ? hostJobsPayload : workspaceJobsPayload;
  const jobs = useMemo(
    () => toJobListItems(jobsPayload, activeWorkspaceName, hostNameById, localeTag),
    [activeWorkspaceName, hostNameById, jobsPayload, localeTag],
  );

  const isLoading =
    isAuthLoading ||
    workspaceQuery.isLoading ||
    currentUserQuery.isLoading ||
    hostsQuery.isLoading ||
    membersQuery.isLoading ||
    invitationsQuery.isLoading ||
    jobsWorkspaceQuery.isLoading ||
    jobsByHostQuery.isLoading;
  const isJobsLoading = jobsWorkspaceQuery.isLoading || jobsByHostQuery.isLoading;
  const isError =
    workspaceQuery.isError ||
    currentUserQuery.isError ||
    hostsQuery.isError ||
    membersQuery.isError ||
    invitationsQuery.isError ||
    jobsWorkspaceQuery.isError ||
    jobsByHostQuery.isError;
  const isJobsError = jobsWorkspaceQuery.isError || jobsByHostQuery.isError;

  return {
    workspaces,
    currentUser,
    invitations,
    hosts,
    members,
    hostOptions,
    activeWorkspaceId,
    selectedHostId,
    jobs,
    isLoading,
    isError,
    isWorkspacesLoading: workspaceQuery.isLoading,
    isWorkspacesError: workspaceQuery.isError,
    isInvitationsLoading: invitationsQuery.isLoading,
    isInvitationsError: invitationsQuery.isError,
    isHostsLoading: hostsQuery.isLoading,
    isHostsError: hostsQuery.isError,
    isMembersLoading: membersQuery.isLoading,
    isMembersError: membersQuery.isError,
    isJobsLoading,
    isJobsError,
  };
};
