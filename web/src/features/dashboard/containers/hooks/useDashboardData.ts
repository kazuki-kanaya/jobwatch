// Responsibility: Fetch dashboard entities via Orval hooks and map them to view DTO inputs.
import { useMemo } from "react";
import {
  useDashboardCurrentUserQuery,
  useDashboardHostsQuery,
  useDashboardInvitationsQuery,
  useDashboardJobsByHostQuery,
  useDashboardJobsQuery,
  useDashboardMembersQuery,
  useDashboardWorkspacesQuery,
} from "@/features/dashboard/api/dashboardQueries";
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
  const currentUser = useMemo(
    () => toCurrentUser(currentUserQuery.data?.status === 200 ? currentUserQuery.data.data : undefined),
    [currentUserQuery.data],
  );

  const workspaceQuery = useDashboardWorkspacesQuery(accessToken, canRequest && !isAuthLoading);
  const workspaces = useMemo(() => toWorkspaceOptions(workspaceQuery.data?.data), [workspaceQuery.data?.data]);

  const activeWorkspaceId = workspaceId || workspaces[0]?.id || "";

  const hostsQuery = useDashboardHostsQuery(activeWorkspaceId || null, accessToken, canRequest);
  const hostPayload = Array.isArray(hostsQuery.data?.data) ? hostsQuery.data.data : undefined;

  const hostOptions = useMemo(() => {
    const mappedHosts = toHostOptions(hostPayload);
    return [{ id: ALL_FILTER_ID, name: allLabel }, ...mappedHosts];
  }, [allLabel, hostPayload]);
  const hosts = useMemo(() => toHostOptions(hostPayload), [hostPayload]);

  const membersQuery = useDashboardMembersQuery(activeWorkspaceId || null, accessToken, canRequest);
  const memberPayload =
    !Array.isArray(membersQuery.data?.data) && membersQuery.data?.status === 200 ? membersQuery.data.data : undefined;
  const members = useMemo(() => {
    const mappedMembers = toMemberItems(memberPayload);
    if (!currentUser) return mappedMembers;

    return mappedMembers.map((member) =>
      member.userId === currentUser.userId && !member.userName ? { ...member, userName: currentUser.name } : member,
    );
  }, [currentUser, memberPayload]);

  const invitationsQuery = useDashboardInvitationsQuery(activeWorkspaceId || null, accessToken, canRequest);
  const invitationsPayload =
    !Array.isArray(invitationsQuery.data?.data) && invitationsQuery.data?.status === 200
      ? invitationsQuery.data.data
      : undefined;
  const invitations = useMemo(() => toInvitationItems(invitationsPayload, localeTag), [invitationsPayload, localeTag]);

  const selectedHostId = hostOptions.some((host) => host.id === hostId) ? hostId : ALL_FILTER_ID;
  const activeHostId = selectedHostId === ALL_FILTER_ID ? null : selectedHostId;
  const activeWorkspaceName = workspaces.find((workspace) => workspace.id === activeWorkspaceId)?.name ?? allLabel;
  const activeHostName = hostOptions.find((host) => host.id === selectedHostId)?.name ?? allLabel;

  const jobsWorkspaceQuery = useDashboardJobsQuery(activeWorkspaceId || null, accessToken, canRequest && !activeHostId);
  const jobsByHostQuery = useDashboardJobsByHostQuery(activeWorkspaceId || null, activeHostId, accessToken, canRequest);

  const workspaceJobsPayload = Array.isArray(jobsWorkspaceQuery.data?.data) ? jobsWorkspaceQuery.data.data : undefined;
  const hostJobsPayload = Array.isArray(jobsByHostQuery.data?.data) ? jobsByHostQuery.data.data : undefined;
  const jobsPayload = activeHostId ? hostJobsPayload : workspaceJobsPayload;
  const jobs = useMemo(
    () => toJobListItems(jobsPayload, activeWorkspaceName, activeHostName, localeTag),
    [activeHostName, activeWorkspaceName, jobsPayload, localeTag],
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
  const isError =
    workspaceQuery.isError ||
    currentUserQuery.isError ||
    hostsQuery.isError ||
    membersQuery.isError ||
    invitationsQuery.isError ||
    jobsWorkspaceQuery.isError ||
    jobsByHostQuery.isError;

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
  };
};
