import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { useHostQueries } from "@/features/host";
import { useJobMutations } from "@/features/job/api/useJobMutations";
import { useJobSearchQuery } from "@/features/job/api/useJobQueries";
import { JobDeleteDialog } from "@/features/job/components/JobDeleteDialog/JobDeleteDialog";
import { JobDetail } from "@/features/job/components/JobDetail/JobDetail";
import { JobList } from "@/features/job/components/JobList/JobList";
import { JobSection } from "@/features/job/components/JobSection/JobSection";
import type { JobStatusUi } from "@/features/job/components/types";
import { useJobPermissions } from "@/features/job/hooks/useJobPermissions";
import { useJobSelection } from "@/features/job/hooks/useJobSelection";
import { useJobViewModel } from "@/features/job/hooks/useJobViewModel";
import { useMemberQueries } from "@/features/member";
import type { CurrentUser } from "@/features/user";
import type { JobStatus } from "@/generated/api";
import { useLocale } from "@/i18n/LocaleProvider";
import { useDisplaySettings } from "@/providers/DisplaySettingsProvider";

type JobFeatureProps = {
  workspaceId: string;
  currentUser: CurrentUser | null;
};

const JOB_PAGE_LIMIT = 10;

type JobFilters = {
  status: JobStatus | "all";
  hostId: string;
  tag: string;
  query: string;
};

const defaultFilters: JobFilters = {
  status: "all",
  hostId: "all",
  tag: "",
  query: "",
};

export function JobFeature({ workspaceId, currentUser }: JobFeatureProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLocale();
  const { formatDateTime } = useDisplaySettings();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(() => new Set());
  const previousWorkspaceIdRef = useRef(workspaceId);
  const currentCursor = cursorStack[cursorStack.length - 1] ?? null;
  const currentOffset = Number(currentCursor ?? 0);

  const searchParams = useMemo(
    () => ({
      status: filters.status === "all" ? undefined : filters.status,
      host_id: filters.hostId === "all" ? undefined : filters.hostId,
      tag: filters.tag.trim() || undefined,
      q: filters.query.trim() || undefined,
      limit: JOB_PAGE_LIMIT,
      cursor: currentCursor,
    }),
    [currentCursor, filters],
  );

  const { jobsQuery } = useJobSearchQuery({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
    params: searchParams,
  });
  const { hostsQuery } = useHostQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const { membersQuery } = useMemberQueries({
    accessToken,
    enabled: canAccessFeature,
    workspaceId,
  });

  const { canManage } = useJobPermissions({
    currentUser,
    members: membersQuery.data?.members,
  });
  const hostNameById = useMemo(
    () => new Map((hostsQuery.data ?? []).map((host) => [host.host_id, host.name])),
    [hostsQuery.data],
  );

  const { jobs, viewState } = useJobViewModel({
    workspaceId,
    jobsQuery: {
      data: jobsQuery.data?.items,
      isLoading: jobsQuery.isLoading,
      isError: jobsQuery.isError,
    },
    hostNameById,
    formatDateTime,
  });

  const { selectedJobId, setSelectedJobId, selectedJob } = useJobSelection(jobs);
  const [pendingDeleteJobId, setPendingDeleteJobId] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const { deleteJob, bulkDeleteJobs, isDeleting } = useJobMutations({
    accessToken,
    workspaceId,
  });

  useEffect(() => {
    if (previousWorkspaceIdRef.current === workspaceId) return;
    previousWorkspaceIdRef.current = workspaceId;
    setFilters(defaultFilters);
    setCursorStack([null]);
    setSelectedJobIds(new Set());
  }, [workspaceId]);

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

  const handleConfirmBulkDelete = async () => {
    const jobIds = Array.from(selectedJobIds);
    if (jobIds.length === 0) return;

    try {
      await bulkDeleteJobs(jobIds);
      toast.success(t("dashboard_jobs_bulk_deleted"));
      setSelectedJobIds(new Set());
      setIsBulkDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard_job_crud_error"));
    }
  };

  const updateFilters = (patch: Partial<JobFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setCursorStack([null]);
    setSelectedJobIds(new Set());
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds((current) => {
      const next = new Set(current);
      if (next.has(jobId)) {
        next.delete(jobId);
        return next;
      }
      next.add(jobId);
      return next;
    });
  };

  const toggleCurrentPageSelection = () => {
    const pageJobIds = jobs.map((job) => job.id);
    setSelectedJobIds((current) => {
      const next = new Set(current);
      const allSelected = pageJobIds.length > 0 && pageJobIds.every((jobId) => next.has(jobId));
      for (const jobId of pageJobIds) {
        if (allSelected) {
          next.delete(jobId);
          continue;
        }
        next.add(jobId);
      }
      return next;
    });
  };

  const goToNextPage = () => {
    if (!jobsQuery.data?.next_cursor) return;
    setCursorStack((current) => [...current, jobsQuery.data?.next_cursor ?? null]);
  };

  const goToPreviousPage = () => {
    setCursorStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  };

  const statusLabels: Record<JobStatusUi, string> = {
    running: t("status_running"),
    completed: t("status_completed"),
    failed: t("status_failed"),
    canceled: t("status_canceled"),
  };
  const statusFilterLabels: Record<JobStatus | "all", string> = {
    all: t("dashboard_all_statuses"),
    running: t("status_running"),
    finished: t("status_completed"),
    failed: t("status_failed"),
    canceled: t("status_canceled"),
  };
  const selectedCount = selectedJobIds.size;
  const totalCount = jobsQuery.data?.total_count ?? 0;
  const pageStart = totalCount === 0 ? 0 : currentOffset + 1;
  const pageEnd = Math.min(currentOffset + jobs.length, totalCount);
  const formatCountMessage = (message: string) => message.replace("{count}", String(selectedCount));
  const formatJobMessage = (message: string, jobId: string) => message.replace("{jobId}", jobId);

  useEffect(() => {
    if (!jobsQuery.data || jobs.length > 0 || !currentCursor || jobsQuery.data.total_count === 0) return;
    setCursorStack((current) => (current.length > 1 ? current.slice(0, -1) : [null]));
  }, [currentCursor, jobs.length, jobsQuery.data]);

  return (
    <JobSection
      title={t("dashboard_recent_jobs")}
      list={
        <JobList
          jobs={jobs}
          state={viewState}
          selectedJobId={selectedJobId}
          selectedJobIds={selectedJobIds}
          emptyLabel={t("dashboard_empty_jobs")}
          errorLabel={t("dashboard_jobs_error")}
          deleteLabel={t("dashboard_delete")}
          deleteSelectedLabel={t("dashboard_delete_selected")}
          canManage={canManage}
          hostLabel={t("dashboard_host")}
          startedAtLabel={t("dashboard_started_at")}
          durationLabel={t("dashboard_duration")}
          statusLabels={statusLabels}
          statusFilterLabels={statusFilterLabels}
          filters={filters}
          hostOptions={(hostsQuery.data ?? []).map((host) => ({ id: host.host_id, name: host.name }))}
          filterLabels={{
            status: t("dashboard_status"),
            host: t("dashboard_host"),
            allHosts: t("dashboard_all_hosts"),
            keyword: t("dashboard_job_keyword"),
            keywordPlaceholder: t("dashboard_job_keyword_placeholder"),
            tag: t("dashboard_tags"),
            tagPlaceholder: t("dashboard_job_tag_placeholder"),
            selectPage: t("dashboard_select_page"),
            selected: formatCountMessage(t("dashboard_jobs_selected")),
            selectJob: (jobId) => formatJobMessage(t("dashboard_select_job"), jobId),
            clearSelection: t("dashboard_clear_selection"),
          }}
          pagination={{
            pageRangeLabel: `${pageStart}-${pageEnd} / ${totalCount}`,
            previousLabel: t("dashboard_previous"),
            nextLabel: t("dashboard_next"),
            canPrevious: cursorStack.length > 1,
            canNext: Boolean(jobsQuery.data?.next_cursor),
          }}
          onSelectJob={setSelectedJobId}
          onDeleteJob={setPendingDeleteJobId}
          onToggleJobSelection={toggleJobSelection}
          onToggleCurrentPageSelection={toggleCurrentPageSelection}
          onClearSelection={() => setSelectedJobIds(new Set())}
          onBulkDelete={() => setIsBulkDeleteOpen(true)}
          onFiltersChange={updateFilters}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
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
            hostId: t("dashboard_job_host_id"),
            status: t("dashboard_status"),
            tags: t("dashboard_tags"),
            startedAt: t("dashboard_started_at"),
            finishedAt: t("dashboard_finished_at"),
            duration: t("dashboard_duration"),
            latestLogs: t("dashboard_latest_logs"),
            viewFull: t("dashboard_view_full"),
          }}
        />
      }
      dialogs={
        <>
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
          <JobDeleteDialog
            title={t("dashboard_jobs_bulk_delete_confirm_title")}
            description={formatCountMessage(t("dashboard_jobs_bulk_delete_confirm_description"))}
            cancelLabel={t("dashboard_cancel")}
            deleteLabel={t("dashboard_delete")}
            isSubmitting={isDeleting}
            isOpen={isBulkDeleteOpen}
            onClose={() => setIsBulkDeleteOpen(false)}
            onConfirm={handleConfirmBulkDelete}
          />
        </>
      }
    />
  );
}
