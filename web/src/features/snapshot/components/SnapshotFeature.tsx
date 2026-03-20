import { useAuth } from "react-oidc-context";
import { useJobQueries } from "@/features/job";
import { SnapshotSection } from "@/features/snapshot/components/SnapshotSection/SnapshotSection";
import { useSnapshotViewModel } from "@/features/snapshot/hooks/useSnapshotViewModel";
import { useLocale } from "@/i18n/LocaleProvider";

type SnapshotFeatureProps = {
  workspaceId: string;
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

  const { snapshot, viewState } = useSnapshotViewModel({
    workspaceId,
    jobs: jobsQuery.data,
    isLoading: jobsQuery.isLoading,
    isError: jobsQuery.isError,
  });

  return (
    <SnapshotSection
      snapshot={snapshot}
      state={viewState}
      errorLabel={t("dashboard_jobs_error")}
      labels={{
        tracked: t("dashboard_snapshot_tracked"),
        running: t("dashboard_snapshot_running"),
        completed: t("dashboard_snapshot_completed"),
        canceled: t("dashboard_snapshot_canceled"),
        failed: t("dashboard_snapshot_failed"),
      }}
    />
  );
}
