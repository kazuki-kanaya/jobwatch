import type { MembershipRole } from "@/generated/api";

export type JobStatus = "running" | "completed" | "failed" | "canceled";

export type JobListItem = {
  id: string;
  jobId: string;
  workspaceId: string;
  hostId: string;
  title: string;
  project: string;
  workspace: string;
  host: string;
  startedAtIso: string;
  finishedAtIso: string | null;
  startedAt: string;
  finishedAt: string | null;
  duration: string;
  status: JobStatus;
  command: string;
  args: string[];
  tags: string[];
  errorMessage: string | null;
  tailLines: string[];
};

export type DashboardSnapshot = {
  total: number;
  running: number;
  completed: number;
  failed: number;
  updatedAt: string;
};

export type DashboardSelectOption = {
  id: string;
  name: string;
};

export type DashboardHostItem = {
  id: string;
  name: string;
};

export type DashboardMemberItem = {
  userId: string;
  userName: string | null;
  role: MembershipRole;
};

export type DashboardCurrentUser = {
  userId: string;
  name: string;
};

export type DashboardInvitationItem = {
  id: string;
  role: MembershipRole;
  createdBy: string;
  createdByUserId: string;
  expiresAtIso: string;
  expiresAt: string;
  usedAt: string | null;
};

export type DashboardViewModel = {
  title: string;
  subtitle: string;
  texts: {
    missionControl: string;
    currentUser: string;
    profileEdit: string;
    profileName: string;
    profileUpdated: string;
    profileUpdateError: string;
    updatedAt: string;
    refresh: string;
    signOut: string;
    filters: string;
    apply: string;
    recentJobs: string;
    noJobs: string;
    jobsError: string;
    jobDeleted: string;
    jobCrudError: string;
    jobDeleteConfirmTitle: string;
    jobDeleteConfirmDescription: string;
    detail: string;
    selectedJob: string;
    jobId: string;
    project: string;
    latestLogs: string;
    command: string;
    args: string;
    tags: string;
    status: string;
    startedAt: string;
    finishedAt: string;
    duration: string;
    error: string;
    detailEmpty: string;
    logsEmpty: string;
    workspaces: string;
    workspaceName: string;
    workspaceNewOwnerUserId: string;
    workspaceTransferOwner: string;
    invitations: string;
    invitationRole: string;
    invitationCreatedBy: string;
    invitationExpiresAt: string;
    invitationUsedAt: string;
    invitationStatusActive: string;
    invitationStatusUsed: string;
    invitationStatusExpired: string;
    invitationRevokeConfirmTitle: string;
    invitationRevokeConfirmDescription: string;
    invitationsEmpty: string;
    invitationsError: string;
    invitationRevoked: string;
    invitationCrudError: string;
    workspacesEmpty: string;
    workspacesError: string;
    workspaceCreated: string;
    workspaceUpdated: string;
    workspaceDeleted: string;
    workspaceOwnerTransferred: string;
    workspaceCrudError: string;
    workspaceDeleteConfirmTitle: string;
    workspaceDeleteConfirmDescription: string;
    hosts: string;
    hostName: string;
    members: string;
    memberUserId: string;
    memberUsername: string;
    memberRole: string;
    membersEmpty: string;
    membersError: string;
    memberAdded: string;
    memberUpdated: string;
    memberRemoved: string;
    memberCrudError: string;
    invitationLink: string;
    invitationLinkPlaceholder: string;
    generateInvite: string;
    copyLink: string;
    copyToken: string;
    invitationLinkCreated: string;
    invitationLinkCopied: string;
    invitationLinkCreateError: string;
    add: string;
    update: string;
    cancel: string;
    delete: string;
    hostsEmpty: string;
    hostsError: string;
    hostToken: string;
    hostTokenCopied: string;
    hostTokenCopyError: string;
    hostCrudError: string;
    hostCreated: string;
    hostUpdated: string;
    hostDeleted: string;
    hostDeleteConfirmTitle: string;
    hostDeleteConfirmDescription: string;
    memberDeleteConfirmTitle: string;
    memberDeleteConfirmDescription: string;
    noPermission: string;
    snapshotTracked: string;
    snapshotRunning: string;
    snapshotCompleted: string;
    snapshotFailed: string;
    statusLabels: Record<JobStatus, string>;
  };
  language: {
    label: string;
    current: string;
    options: DashboardSelectOption[];
  };
  filters: {
    workspaceLabel: string;
    hostLabel: string;
    queryLabel: string;
    workspaceOptions: DashboardSelectOption[];
    hostOptions: DashboardSelectOption[];
    workspaceId: string;
    hostId: string;
    query: string;
  };
  snapshot: DashboardSnapshot;
  jobs: JobListItem[];
  hosts: DashboardHostItem[];
  members: DashboardMemberItem[];
  invitations: DashboardInvitationItem[];
  currentUser: DashboardCurrentUser | null;
  selectedJob: JobListItem | null;
};
