import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { useJobMutations } from "@/features/job/api/useJobMutations";
import { useJobQueries } from "@/features/job/api/useJobQueries";
import { JobDeleteDialog } from "@/features/job/components/JobDeleteDialog/JobDeleteDialog";
import { JobDetail } from "@/features/job/components/JobDetail/JobDetail";
import { JobList } from "@/features/job/components/JobList/JobList";
import { JobSection } from "@/features/job/components/JobSection/JobSection";
import type { JobStatusUi } from "@/features/job/components/types";
import { useJobPermissions } from "@/features/job/hooks/useJobPermissions";
import { useJobSelection } from "@/features/job/hooks/useJobSelection";
import { useJobViewModel } from "@/features/job/hooks/useJobViewModel";
import type { CurrentUser } from "@/features/user";
import { useWorkspaceQueries } from "@/features/workspace/api/useWorkspaceQueries";
import { useLocale } from "@/i18n/LocaleProvider";
import { useDisplaySettings } from "@/providers/DisplaySettingsProvider";

type JobFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
};

export function JobFeature({ workspaceId, currentUser }: JobFeatureProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const { formatDateTime } = useDisplaySettings();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);

  const { jobsQuery } = useJobQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const { membersQuery } = useWorkspaceQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const { canManage } = useJobPermissions({
    currentUser,
    members: membersQuery.data?.members,
  });

  const { jobs, viewState } = useJobViewModel({
    workspaceId,
    jobsQuery: {
      data: jobsQuery.data,
      isLoading: jobsQuery.isLoading,
      isError: jobsQuery.isError,
    },
    formatDateTime,
  });

  const { selectedJobId, setSelectedJobId, selectedJob } = useJobSelection(jobs);
  const [pendingDeleteJobId, setPendingDeleteJobId] = useState<string | null>(null);

  const { deleteJob, isDeleting } = useJobMutations({
    accessToken,
    workspaceId,
  });

  const handleConfirmDelete = async () => {
    if (!pendingDeleteJobId) return;

    try {
      await deleteJob(pendingDeleteJobId);
      toast.success(t("dashboard_job_deleted"));
      setPendingDeleteJobId(null);
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard_job_crud_error"));
    }
  };

  const statusLabels: Record<JobStatusUi, string> = {
    running: t("status_running"),
    completed: t("status_completed"),
    failed: t("status_failed"),
    canceled: t("status_canceled"),
  };

  return (
    <JobSection
      title={t("dashboard_recent_jobs")}
      subtitle={workspaceId ? null : t("dashboard_workspace_scope_hint")}
      list={
        <JobList
          jobs={jobs}
          state={viewState}
          selectedJobId={selectedJobId}
          emptyLabel={t("dashboard_empty_jobs")}
          errorLabel={t("dashboard_jobs_error")}
          deleteLabel={t("dashboard_delete")}
          canManage={canManage}
          startedAtLabel={t("dashboard_started_at")}
          durationLabel={t("dashboard_duration")}
          statusLabels={statusLabels}
          onSelectJob={setSelectedJobId}
          onDeleteJob={setPendingDeleteJobId}
        />
      }
      detail={
        <JobDetail
          selectedJob={selectedJob}
          title={t("dashboard_detail")}
          selectedJobLabel={t("dashboard_selected_job")}
          emptyLabel={t("dashboard_detail_empty")}
          logsEmptyLabel={t("dashboard_logs_empty")}
          copyLabel={t("dashboard_copy")}
          copiedLabel={t("dashboard_copied")}
          statusLabel={selectedJob ? statusLabels[selectedJob.status] : null}
          labels={{
            jobId: t("dashboard_job_id"),
            project: t("dashboard_project"),
            status: t("dashboard_status"),
            command: t("dashboard_command"),
            args: t("dashboard_args"),
            tags: t("dashboard_tags"),
            startedAt: t("dashboard_started_at"),
            finishedAt: t("dashboard_finished_at"),
            duration: t("dashboard_duration"),
            latestLogs: t("dashboard_latest_logs"),
            error: t("dashboard_error"),
          }}
        />
      }
      dialogs={
        <JobDeleteDialog
          title={t("dashboard_job_delete_confirm_title")}
          description={t("dashboard_job_delete_confirm_description")}
          cancelLabel={t("dashboard_cancel")}
          deleteLabel={t("dashboard_delete")}
          isSubmitting={isDeleting}
          isOpen={pendingDeleteJobId !== null}
          onClose={() => setPendingDeleteJobId(null)}
          onConfirm={handleConfirmDelete}
        />
      }
    />
  );
}
