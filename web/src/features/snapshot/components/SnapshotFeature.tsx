import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useSnapshotQueries } from "@/features/snapshot/api/useSnapshotQueries";
import { SnapshotSection } from "@/features/snapshot/components/SnapshotSection/SnapshotSection";
import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot/components/types";
import { useLocale } from "@/i18n/LocaleProvider";

type SnapshotFeatureProps = {
  workspaceId: string;
};

const EMPTY_SNAPSHOT: SnapshotMetrics = {
  tracked: 0,
  running: 0,
  completed: 0,
  failed: 0,
};

export function SnapshotFeature({ workspaceId }: SnapshotFeatureProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  const { jobsQuery } = useSnapshotQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const snapshot = useMemo<SnapshotMetrics>(() => {
    if (!workspaceId) return EMPTY_SNAPSHOT;

    const jobs = jobsQuery.data ?? [];
    return {
      tracked: jobs.length,
      running: jobs.filter((job) => job.status === "RUNNING").length,
      completed: jobs.filter((job) => job.status === "FINISHED").length,
      failed: jobs.filter((job) => job.status === "FAILED").length,
    };
  }, [workspaceId, jobsQuery.data]);

  const viewState: SnapshotViewState = !workspaceId
    ? "ready"
    : jobsQuery.isLoading
      ? "loading"
      : jobsQuery.isError
        ? "error"
        : "ready";

  return (
    <SnapshotSection
      snapshot={snapshot}
      state={viewState}
      errorLabel={t("dashboard_jobs_error")}
      labels={{
        tracked: t("dashboard_snapshot_tracked"),
        running: t("dashboard_snapshot_running"),
        completed: t("dashboard_snapshot_completed"),
        failed: t("dashboard_snapshot_failed"),
      }}
    />
  );
}
