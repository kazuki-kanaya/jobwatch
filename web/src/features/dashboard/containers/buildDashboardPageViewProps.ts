import { isLocale, isMembershipRole } from "@/features/dashboard/containers/dashboardGuards";
import type { useDashboardData } from "@/features/dashboard/containers/hooks/useDashboardData";
import type { useDashboardHostCrud } from "@/features/dashboard/containers/hooks/useDashboardHostCrud";
import type { useDashboardJobCrud } from "@/features/dashboard/containers/hooks/useDashboardJobCrud";
import type { useDashboardMemberCrud } from "@/features/dashboard/containers/hooks/useDashboardMemberCrud";
import type { useDashboardSelection } from "@/features/dashboard/containers/hooks/useDashboardSelection";
import type { useDashboardUserProfile } from "@/features/dashboard/containers/hooks/useDashboardUserProfile";
import type { useDashboardWorkspaceCrud } from "@/features/dashboard/containers/hooks/useDashboardWorkspaceCrud";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";
import type { Locale } from "@/i18n/messages";

type BuildDashboardPageViewPropsParams = {
  model: DashboardPageViewProps["model"];
  jobsUiState: DashboardPageViewProps["jobsUiState"];
  isRefreshing: boolean;
  setLocale: (locale: Locale) => void;
  setWorkspaceId: (workspaceId: string) => void;
  setHostId: (hostId: string) => void;
  setQueryInput: (query: string) => void;
  refreshDashboard: () => Promise<void>;
  applyFilters: () => void;
  signOut: () => void;
  selection: ReturnType<typeof useDashboardSelection>;
  userProfile: ReturnType<typeof useDashboardUserProfile>;
  jobCrud: ReturnType<typeof useDashboardJobCrud>;
  hostCrud: ReturnType<typeof useDashboardHostCrud>;
  memberCrud: ReturnType<typeof useDashboardMemberCrud>;
  workspaceCrud: ReturnType<typeof useDashboardWorkspaceCrud>;
  canCreateWorkspace: boolean;
  canManageWorkspace: boolean;
  canManageHosts: boolean;
  canManageMembers: boolean;
  canManageJobs: boolean;
  data: Pick<
    ReturnType<typeof useDashboardData>,
    | "isWorkspacesLoading"
    | "isWorkspacesError"
    | "isInvitationsLoading"
    | "isInvitationsError"
    | "isHostsLoading"
    | "isHostsError"
    | "isMembersLoading"
    | "isMembersError"
  >;
};

export const buildDashboardPageViewProps = ({
  model,
  jobsUiState,
  isRefreshing,
  setLocale,
  setWorkspaceId,
  setHostId,
  setQueryInput,
  refreshDashboard,
  applyFilters,
  signOut,
  selection,
  userProfile,
  jobCrud,
  hostCrud,
  memberCrud,
  workspaceCrud,
  canCreateWorkspace,
  canManageWorkspace,
  canManageHosts,
  canManageMembers,
  canManageJobs,
  data,
}: BuildDashboardPageViewPropsParams): DashboardPageViewProps => {
  const transferOwnerOptions = model.members.map((member) => ({
    id: member.userId,
    name: member.userName ? `${member.userName} (${member.userId})` : member.userId,
  }));
  const canSubmitWorkspace = workspaceCrud.editingWorkspaceId ? canManageWorkspace : canCreateWorkspace;

  return {
    model,
    workspaceManagement: {
      workspaceDraftName: workspaceCrud.workspaceDraftName,
      transferOwnerUserId: workspaceCrud.transferOwnerUserId,
      transferOwnerOptions,
      editingWorkspaceId: workspaceCrud.editingWorkspaceId,
      transferWorkspaceId: workspaceCrud.transferWorkspaceId,
      pendingDeleteWorkspaceId: workspaceCrud.pendingDeleteWorkspaceId,
      pendingRevokeInvitationId: workspaceCrud.pendingRevokeInvitationId,
      invitations: model.invitations,
      isWorkspaceSubmitting: workspaceCrud.isWorkspaceSubmitting,
      isWorkspacesLoading: data.isWorkspacesLoading,
      isWorkspacesError: data.isWorkspacesError,
      isInvitationsLoading: data.isInvitationsLoading,
      isInvitationsError: data.isInvitationsError,
      isWorkspaceFormOpen: workspaceCrud.isWorkspaceFormOpen,
      isWorkspaceTransferDialogOpen: workspaceCrud.isWorkspaceTransferDialogOpen,
      onOpenWorkspaceCreateForm: () => canCreateWorkspace && workspaceCrud.openWorkspaceCreateForm(),
      onStartEditWorkspace: (workspaceId) => canManageWorkspace && workspaceCrud.startEditWorkspace(workspaceId),
      onWorkspaceDraftNameChange: workspaceCrud.setWorkspaceDraftName,
      onCloseWorkspaceForm: workspaceCrud.closeWorkspaceForm,
      onSubmitWorkspace: () => canSubmitWorkspace && workspaceCrud.submitWorkspace(),
      onOpenWorkspaceTransferDialog: (workspaceId) =>
        canManageWorkspace && workspaceCrud.openTransferOwnerDialog(workspaceId),
      onTransferOwnerUserIdChange: workspaceCrud.setTransferOwnerUserId,
      onCloseWorkspaceTransferDialog: () => canManageWorkspace && workspaceCrud.closeTransferOwnerDialog(),
      onSubmitWorkspaceTransfer: () => canManageWorkspace && workspaceCrud.submitTransferOwner(),
      onRequestRevokeInvitation: (invitationId) =>
        canManageWorkspace && workspaceCrud.requestRevokeInvitation(invitationId),
      onCancelRevokeInvitation: () => canManageWorkspace && workspaceCrud.cancelRevokeInvitation(),
      onConfirmRevokeInvitation: () => canManageWorkspace && workspaceCrud.confirmRevokeInvitation(),
      onRequestDeleteWorkspace: (workspaceId) =>
        canManageWorkspace && workspaceCrud.requestDeleteWorkspace(workspaceId),
      onCancelDeleteWorkspace: () => canManageWorkspace && workspaceCrud.cancelDeleteWorkspace(),
      onConfirmDeleteWorkspace: () => canManageWorkspace && workspaceCrud.confirmDeleteWorkspace(),
      canCreateWorkspace,
      canManageWorkspace,
    },
    canManageHosts,
    canManageMembers,
    canManageJobs,
    jobsUiState,
    isRefreshing,
    onLocaleChange: (nextLocale) => isLocale(nextLocale) && setLocale(nextLocale),
    onWorkspaceChange: setWorkspaceId,
    onHostChange: setHostId,
    onQueryChange: setQueryInput,
    onRefresh: () => void refreshDashboard(),
    onApplyFilters: applyFilters,
    onSignOut: signOut,
    isUserProfileDialogOpen: userProfile.isProfileDialogOpen,
    userProfileDraftName: userProfile.draftName,
    isUserProfileSubmitting: userProfile.isSubmitting,
    onOpenUserProfileDialog: userProfile.openProfileDialog,
    onCloseUserProfileDialog: userProfile.closeProfileDialog,
    onUserProfileDraftNameChange: userProfile.setDraftName,
    onSubmitUserProfile: () => void userProfile.submitProfile(),
    onSelectJob: selection.setSelectedJobId,
    onSelectPreviousJob: selection.selectPreviousJob,
    onSelectNextJob: selection.selectNextJob,
    selectedJobId: selection.selectedJobId,
    pendingDeleteJobId: jobCrud.pendingDeleteJobId,
    isJobSubmitting: jobCrud.isJobSubmitting,
    onRequestDeleteJob: (jobId) => canManageJobs && jobCrud.requestDeleteJob(jobId),
    onCancelDeleteJob: () => canManageJobs && jobCrud.cancelDeleteJob(),
    onConfirmDeleteJob: () => canManageJobs && jobCrud.confirmDeleteJob(),
    hostDraftName: hostCrud.hostDraftName,
    editingHostId: hostCrud.editingHostId,
    hostToken: hostCrud.hostToken,
    hostTokenMessage: hostCrud.hostTokenMessage,
    isHostSubmitting: hostCrud.isHostSubmitting,
    isHostsLoading: data.isHostsLoading,
    isHostsError: data.isHostsError,
    isHostFormOpen: hostCrud.isHostFormOpen,
    pendingDeleteHostId: hostCrud.pendingDeleteHostId,
    onOpenHostCreate: () => canManageHosts && hostCrud.openCreateHostForm(),
    onHostDraftChange: hostCrud.setHostDraftName,
    onHostSubmit: () => canManageHosts && hostCrud.submitHost(),
    onHostCopyToken: () => canManageHosts && hostCrud.copyHostToken(),
    onHostStartEdit: (hostId) => canManageHosts && hostCrud.startEditHost(hostId),
    onHostCloseForm: () => canManageHosts && hostCrud.closeHostForm(),
    onHostRequestDelete: (hostId) => canManageHosts && hostCrud.requestDeleteHost(hostId),
    onHostCancelDelete: () => canManageHosts && hostCrud.cancelDeleteHost(),
    onHostConfirmDelete: () => canManageHosts && hostCrud.confirmDeleteHost(),
    memberDraftUserId: memberCrud.draftUserId,
    memberDraftRole: memberCrud.draftRole,
    memberInviteRole: memberCrud.inviteRole,
    memberEditingUserId: memberCrud.editingUserId,
    memberEditingRole: memberCrud.editingRole,
    memberInvitationUrl: memberCrud.invitationUrl,
    pendingDeleteMemberUserId: memberCrud.pendingDeleteUserId,
    isMemberSubmitting: memberCrud.isMemberSubmitting,
    isMembersLoading: data.isMembersLoading,
    isMembersError: data.isMembersError,
    isMemberAddDialogOpen: memberCrud.isAddDialogOpen,
    isMemberInviteDialogOpen: memberCrud.isInviteDialogOpen,
    isMemberRoleDialogOpen: memberCrud.isEditDialogOpen,
    onOpenMemberAddDialog: () => canManageMembers && memberCrud.openAddDialog(),
    onCloseMemberAddDialog: () => canManageMembers && memberCrud.closeAddDialog(),
    onOpenMemberInviteDialog: () => canManageMembers && memberCrud.openInviteDialog(),
    onCloseMemberInviteDialog: () => canManageMembers && memberCrud.closeInviteDialog(),
    onMemberDraftUserIdChange: memberCrud.setDraftUserId,
    onMemberDraftRoleChange: (role) => isMembershipRole(role) && memberCrud.setDraftRole(role),
    onMemberInviteRoleChange: (role) => isMembershipRole(role) && memberCrud.setInviteRole(role),
    onMemberEditingRoleChange: (role) => isMembershipRole(role) && memberCrud.setEditingRole(role),
    onMemberSubmitAdd: () => canManageMembers && memberCrud.submitAddMember(),
    onMemberGenerateInvite: () => canManageMembers && memberCrud.createInvitationUrl(),
    onMemberCopyInviteLink: () => canManageMembers && memberCrud.copyInvitationLink(),
    onMemberRequestEdit: (userId, role) =>
      canManageMembers && isMembershipRole(role) && memberCrud.openEditDialog(userId, role),
    onMemberCloseEditDialog: () => canManageMembers && memberCrud.closeEditDialog(),
    onMemberSubmitRoleUpdate: () => canManageMembers && memberCrud.submitUpdateMemberRole(),
    onMemberRequestDelete: (userId) => canManageMembers && memberCrud.requestRemoveMember(userId),
    onMemberCancelDelete: () => canManageMembers && memberCrud.cancelRemoveMember(),
    onMemberConfirmDelete: () => canManageMembers && memberCrud.confirmRemoveMember(),
  };
};
