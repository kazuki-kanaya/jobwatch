// Responsibility: Build dashboard page model and provide UI state flags for the view.
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  useDashboardHostsQuery,
  useDashboardJobsQuery,
  useDashboardWorkspacesQuery,
} from "@/features/dashboard/api/dashboardQueries";
import { toHostOptions, toJobListItems, toWorkspaceOptions } from "@/features/dashboard/lib/mappers";
import type { DashboardViewModel } from "@/features/dashboard/types";
import DashboardPageView from "@/features/dashboard/views/DashboardPageView";
import { useLocale } from "@/i18n/LocaleProvider";

export default function DashboardPageContainer() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { t } = useLocale();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [hostId] = useState<string | null>(null);
  const [keyword] = useState("");
  const accessToken = user?.access_token;
  const canRequest = isAuthenticated && Boolean(accessToken);

  const workspaceQuery = useDashboardWorkspacesQuery(accessToken, canRequest && !isAuthLoading);
  const workspaces = useMemo(() => toWorkspaceOptions(workspaceQuery.data?.data), [workspaceQuery.data?.data]);

  const activeWorkspaceId = workspaceId ?? workspaces[0]?.id ?? null;
  const activeWorkspaceName =
    workspaces.find((workspace) => workspace.id === activeWorkspaceId)?.name ?? t("dashboard_all");

  useEffect(() => {
    if (!workspaceId && activeWorkspaceId) {
      setWorkspaceId(activeWorkspaceId);
    }
  }, [activeWorkspaceId, workspaceId]);

  const hostsQuery = useDashboardHostsQuery(activeWorkspaceId, accessToken, canRequest);
  const hostPayload = Array.isArray(hostsQuery.data?.data) ? hostsQuery.data.data : undefined;
  const hosts = useMemo(() => toHostOptions(hostPayload), [hostPayload]);
  const activeHostName = hosts.find((host) => host.id === hostId)?.name ?? t("dashboard_all");

  const jobsQuery = useDashboardJobsQuery(activeWorkspaceId, accessToken, canRequest);
  const jobsPayload = Array.isArray(jobsQuery.data?.data) ? jobsQuery.data.data : undefined;
  const jobs = useMemo(() => {
    const source = toJobListItems(jobsPayload, activeWorkspaceName, activeHostName);
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return source;

    return source.filter((job) => {
      const searchable = `${job.title} ${job.workspace} ${job.host} ${job.status}`.toLowerCase();
      return searchable.includes(normalizedKeyword);
    });
  }, [activeHostName, activeWorkspaceName, jobsPayload, keyword]);

  const isLoading = isAuthLoading || workspaceQuery.isLoading || hostsQuery.isLoading || jobsQuery.isLoading;
  const isError = workspaceQuery.isError || hostsQuery.isError || jobsQuery.isError;
  const jobsUiState = isLoading ? "loading" : isError ? "error" : jobs.length === 0 ? "empty" : "ready";

  const model: DashboardViewModel = {
    title: t("dashboard_title"),
    subtitle: t("dashboard_subtitle"),
    texts: {
      missionControl: t("dashboard_mission_control"),
      updatedAt: t("dashboard_updated_at_label"),
      refresh: t("dashboard_refresh"),
      alertRules: t("dashboard_alert_rules"),
      filters: t("dashboard_filters"),
      apply: t("dashboard_apply"),
      recentJobs: t("dashboard_recent_jobs"),
      noJobs: t("dashboard_empty_jobs"),
      jobsError: t("dashboard_jobs_error"),
      detail: t("dashboard_detail"),
      selectedJob: t("dashboard_selected_job"),
      latestLogs: t("dashboard_latest_logs"),
      snapshotTracked: t("dashboard_snapshot_tracked"),
      snapshotRunning: t("dashboard_snapshot_running"),
      snapshotCompleted: t("dashboard_snapshot_completed"),
      snapshotFailed: t("dashboard_snapshot_failed"),
      statusLabels: {
        running: t("status_running"),
        completed: t("status_completed"),
        failed: t("status_failed"),
        queued: t("status_queued"),
      },
    },
    filters: {
      workspace: `${t("dashboard_filter_workspace")}: ${activeWorkspaceName}`,
      host: `${t("dashboard_filter_host")}: ${activeHostName}`,
      query: `${t("dashboard_filter_query")}: ${keyword || t("dashboard_all")}`,
    },
    snapshot: {
      total: jobs.length,
      running: jobs.filter((job) => job.status === "running").length,
      completed: jobs.filter((job) => job.status === "completed").length,
      failed: jobs.filter((job) => job.status === "failed").length,
      updatedAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    jobs,
  };

  return <DashboardPageView model={model} jobsUiState={jobsUiState} />;
}
