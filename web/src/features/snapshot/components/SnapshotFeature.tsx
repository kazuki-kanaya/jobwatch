import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useJobQueries } from "@/features/job/api/useJobQueries";
import { SnapshotSection } from "@/features/snapshot/components/SnapshotSection/SnapshotSection";
import type { SnapshotMetrics, SnapshotViewState } from "@/features/snapshot/components/types";
import { JobStatus } from "@/generated/api";
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

  const { jobsQuery } = useJobQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const snapshot = useMemo<SnapshotMetrics>(() => {
    if (!workspaceId) return EMPTY_SNAPSHOT;

    const jobs = jobsQuery.data ?? [];
    return jobs.reduce<SnapshotMetrics>(
      (acc, job) => {
        acc.tracked += 1;
        if (job.status === JobStatus.RUNNING) acc.running += 1;
        if (job.status === JobStatus.FINISHED) acc.completed += 1;
        if (job.status === JobStatus.FAILED) acc.failed += 1;
        return acc;
      },
      { tracked: 0, running: 0, completed: 0, failed: 0 },
    );
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
