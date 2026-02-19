import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useSearchParams } from "react-router";
import { buildDashboardPageViewProps } from "@/features/dashboard/containers/buildDashboardPageViewProps";
import {
  canManageHosts,
  canManageJobs,
  canManageMembers,
  canManageWorkspace,
  getCurrentMembershipRole,
  localeTagMap,
} from "@/features/dashboard/containers/dashboardGuards";
import { ALL_FILTER_ID } from "@/features/dashboard/containers/hooks/constants";
import { useDashboardData } from "@/features/dashboard/containers/hooks/useDashboardData";
import { useDashboardFilters } from "@/features/dashboard/containers/hooks/useDashboardFilters";
import { useDashboardHostCrud } from "@/features/dashboard/containers/hooks/useDashboardHostCrud";
import { useDashboardJobCrud } from "@/features/dashboard/containers/hooks/useDashboardJobCrud";
import { useDashboardMemberCrud } from "@/features/dashboard/containers/hooks/useDashboardMemberCrud";
import { useDashboardRefresh } from "@/features/dashboard/containers/hooks/useDashboardRefresh";
import { useDashboardSelection } from "@/features/dashboard/containers/hooks/useDashboardSelection";
import { useDashboardUrlSync } from "@/features/dashboard/containers/hooks/useDashboardUrlSync";
import { useDashboardUserProfile } from "@/features/dashboard/containers/hooks/useDashboardUserProfile";
import { buildDashboardViewModel } from "@/features/dashboard/containers/hooks/useDashboardViewModel";
import { useDashboardWorkspaceCrud } from "@/features/dashboard/containers/hooks/useDashboardWorkspaceCrud";
import DashboardPageView from "@/features/dashboard/views/DashboardPageView";
import { useLocale } from "@/i18n/LocaleProvider";
import { env } from "@/lib/env";

export default function DashboardPageContainer() {
  const { isAuthenticated, isLoading: isAuthLoading, user, removeUser } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useDashboardFilters({
    initialWorkspaceId: searchParams.get("workspace") ?? "",
    initialHostId: searchParams.get("host") ?? ALL_FILTER_ID,
    initialQuery: searchParams.get("q") ?? "",
  });
  const { workspaceId, setWorkspaceId, hostId, setHostId, queryInput, setQueryInput, applyFilters, appliedQuery } =
    filters;

  const data = useDashboardData({
    accessToken: user?.access_token,
    canRequest: isAuthenticated && Boolean(user?.access_token),
    isAuthLoading,
    workspaceId,
    hostId,
    localeTag: localeTagMap[locale],
    allLabel: t("dashboard_all"),
  });

  useEffect(() => {
    if (!workspaceId && data.activeWorkspaceId) {
      setWorkspaceId(data.activeWorkspaceId);
    }
  }, [data.activeWorkspaceId, setWorkspaceId, workspaceId]);

  useEffect(() => {
    if (hostId !== data.selectedHostId) {
      setHostId(data.selectedHostId);
    }
  }, [data.selectedHostId, hostId, setHostId]);

  useDashboardUrlSync({
    searchParams,
    setSearchParams,
    activeWorkspaceId: data.activeWorkspaceId,
    selectedHostId: data.selectedHostId,
    appliedQuery,
  });

  const selection = useDashboardSelection({
    jobs: data.jobs,
    appliedQuery,
  });

  const hostCrud = useDashboardHostCrud({
    accessToken: user?.access_token,
    workspaceId: data.activeWorkspaceId,
    hosts: data.hosts,
    texts: {
      hostCreated: t("dashboard_host_created"),
      hostUpdated: t("dashboard_host_updated"),
      hostDeleted: t("dashboard_host_deleted"),
      hostTokenCopied: t("dashboard_host_token_copied"),
      hostTokenCopyError: t("dashboard_host_token_copy_error"),
      hostCrudError: t("dashboard_host_crud_error"),
    },
  });
  const jobCrud = useDashboardJobCrud({
    accessToken: user?.access_token,
    workspaceId: data.activeWorkspaceId,
    texts: {
      jobDeleted: t("dashboard_job_deleted"),
      jobCrudError: t("dashboard_job_crud_error"),
    },
  });

  const memberCrud = useDashboardMemberCrud({
    accessToken: user?.access_token,
    workspaceId: data.activeWorkspaceId,
    texts: {
      memberAdded: t("dashboard_member_added"),
      memberUpdated: t("dashboard_member_updated"),
      memberRemoved: t("dashboard_member_removed"),
      memberCrudError: t("dashboard_member_crud_error"),
      invitationLinkCreated: t("dashboard_invitation_link_created"),
      invitationLinkCopied: t("dashboard_invitation_link_copied"),
      invitationLinkCreateError: t("dashboard_invitation_link_create_error"),
    },
  });
  const refreshState = useDashboardRefresh({
    successMessage: t("dashboard_refresh_success"),
    errorMessage: t("dashboard_refresh_error"),
  });
  const userProfile = useDashboardUserProfile({
    accessToken: user?.access_token,
    currentUser: data.currentUser,
    texts: {
      profileUpdated: t("dashboard_profile_updated"),
      profileUpdateError: t("dashboard_profile_update_error"),
    },
  });
  const workspaceCrud = useDashboardWorkspaceCrud({
    accessToken: user?.access_token,
    workspaceId: data.activeWorkspaceId,
    workspaces: data.workspaces,
    onWorkspaceChange: setWorkspaceId,
    texts: {
      workspaceCreated: t("dashboard_workspace_created"),
      workspaceUpdated: t("dashboard_workspace_updated"),
      workspaceDeleted: t("dashboard_workspace_deleted"),
      workspaceOwnerTransferred: t("dashboard_workspace_owner_transferred"),
      workspaceCrudError: t("dashboard_workspace_crud_error"),
      invitationRevoked: t("dashboard_invitation_revoked"),
      invitationCrudError: t("dashboard_invitation_crud_error"),
    },
  });

  const jobsUiState = data.isJobsLoading
    ? "loading"
    : data.isJobsError
      ? "error"
      : selection.filteredJobs.length === 0
        ? "empty"
        : "ready";

  const model = buildDashboardViewModel({
    locale,
    t,
    updatedAt: new Date().toLocaleString(localeTagMap[locale], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    workspaceId: data.activeWorkspaceId,
    hostId: data.selectedHostId,
    query: queryInput,
    workspaces: data.workspaces,
    currentUser: data.currentUser,
    hostOptions: data.hostOptions,
    hosts: data.hosts,
    members: data.members,
    invitations: data.invitations,
    jobs: selection.filteredJobs,
    selectedJob: selection.selectedJob,
  });
  const currentMembershipRole = getCurrentMembershipRole(data.members, data.currentUser?.userId ?? null);
  const canManageWorkspaceByRole = canManageWorkspace(currentMembershipRole);
  const canManageHostsByRole = canManageHosts(currentMembershipRole);
  const canManageMembersByRole = canManageMembers(currentMembershipRole);
  const canManageJobsByRole = canManageJobs(currentMembershipRole);
  const signOut = () => {
    void removeUser();
    const logoutUrl = new URL(`${env.oidcCognitoDomain}/logout`);
    logoutUrl.searchParams.set("client_id", env.oidcClientId);
    logoutUrl.searchParams.set("logout_uri", `${window.location.origin}/`);
    window.location.assign(logoutUrl.toString());
  };

  return (
    <DashboardPageView
      {...buildDashboardPageViewProps({
        model,
        jobsUiState,
        isRefreshing: refreshState.isRefreshing,
        setLocale,
        setWorkspaceId,
        setHostId,
        setQueryInput,
        refreshDashboard: refreshState.refreshDashboard,
        applyFilters,
        signOut,
        selection,
        userProfile,
        jobCrud,
        hostCrud,
        memberCrud,
        workspaceCrud,
        canCreateWorkspace: isAuthenticated,
        canManageWorkspace: canManageWorkspaceByRole,
        canManageHosts: canManageHostsByRole,
        canManageMembers: canManageMembersByRole,
        canManageJobs: canManageJobsByRole,
        data,
      })}
    />
  );
}
