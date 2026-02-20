import DashboardDetailSection from "@/features/dashboard/components/DashboardDetailSection";
import DashboardHostsSection from "@/features/dashboard/components/DashboardHostsSection";
import DashboardJobsSection from "@/features/dashboard/components/DashboardJobsSection";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";
import { cn } from "@/lib/utils";

type DashboardOverviewTabSectionProps = Pick<
  DashboardPageViewProps,
  | "model"
  | "jobsUiState"
  | "canManageJobs"
  | "selectedJobId"
  | "pendingDeleteJobId"
  | "isJobSubmitting"
  | "onSelectJob"
  | "onRequestDeleteJob"
  | "onCancelDeleteJob"
  | "onConfirmDeleteJob"
  | "onSelectPreviousJob"
  | "onSelectNextJob"
  | "canManageHosts"
  | "hostDraftName"
  | "editingHostId"
  | "hostToken"
  | "hostTokenMessage"
  | "isHostSubmitting"
  | "isHostsLoading"
  | "isHostsError"
  | "isHostFormOpen"
  | "pendingDeleteHostId"
  | "onOpenHostCreate"
  | "onHostDraftChange"
  | "onHostSubmit"
  | "onHostCopyToken"
  | "onHostDismissToken"
  | "onHostStartEdit"
  | "onHostCloseForm"
  | "onHostRequestDelete"
  | "onHostCancelDelete"
  | "onHostConfirmDelete"
>;

export default function DashboardOverviewTabSection(props: DashboardOverviewTabSectionProps) {
  const { model } = props;

  return (
    <section className={cn("space-y-4")}>
      <DashboardHostsSection
        title={model.texts.hosts}
        hostNameLabel={model.texts.hostName}
        addLabel={model.texts.add}
        editLabel={model.texts.edit}
        updateLabel={model.texts.edit}
        cancelLabel={model.texts.cancel}
        deleteLabel={model.texts.delete}
        emptyLabel={model.texts.hostsEmpty}
        errorLabel={model.texts.hostsError}
        noPermissionLabel={model.texts.noPermission}
        canManage={props.canManageHosts}
        tokenLabel={model.texts.hostToken}
        tokenCopyLabel={model.texts.copyToken}
        tokenValue={props.hostToken}
        tokenMessage={props.hostTokenMessage}
        deleteConfirmTitle={model.texts.hostDeleteConfirmTitle}
        deleteConfirmDescription={model.texts.hostDeleteConfirmDescription}
        draftName={props.hostDraftName}
        editingHostId={props.editingHostId}
        hosts={model.hosts}
        isLoading={props.isHostsLoading}
        isError={props.isHostsError}
        isSubmitting={props.isHostSubmitting}
        isFormOpen={props.isHostFormOpen}
        pendingDeleteHostId={props.pendingDeleteHostId}
        onOpenCreate={props.onOpenHostCreate}
        onDraftNameChange={props.onHostDraftChange}
        onSubmit={props.onHostSubmit}
        onCopyToken={props.onHostCopyToken}
        onDismissToken={props.onHostDismissToken}
        onStartEdit={props.onHostStartEdit}
        onCloseForm={props.onHostCloseForm}
        onRequestDelete={props.onHostRequestDelete}
        onCancelDelete={props.onHostCancelDelete}
        onConfirmDelete={props.onHostConfirmDelete}
      />

      <div className={cn("grid gap-4 xl:grid-cols-[1.55fr_1fr]")}>
        <DashboardJobsSection
          jobs={model.jobs}
          uiState={props.jobsUiState}
          title={model.texts.recentJobs}
          emptyLabel={model.texts.noJobs}
          errorLabel={model.texts.jobsError}
          jobIdLabel={model.texts.jobId}
          projectLabel={model.texts.project}
          workspaceLabel={model.texts.workspaceName}
          hostLabel={model.texts.hostName}
          tagsLabel={model.texts.tags}
          startedAtLabel={model.texts.startedAt}
          finishedAtLabel={model.texts.finishedAt}
          durationLabel={model.texts.duration}
          cancelLabel={model.texts.cancel}
          deleteLabel={model.texts.delete}
          noPermissionLabel={model.texts.noPermission}
          deleteConfirmTitle={model.texts.jobDeleteConfirmTitle}
          deleteConfirmDescription={model.texts.jobDeleteConfirmDescription}
          canManage={props.canManageJobs}
          pendingDeleteJobId={props.pendingDeleteJobId}
          isSubmittingDelete={props.isJobSubmitting}
          statusLabels={model.texts.statusLabels}
          selectedJobId={props.selectedJobId}
          onSelectJob={props.onSelectJob}
          onRequestDelete={props.onRequestDeleteJob}
          onCancelDelete={props.onCancelDeleteJob}
          onConfirmDelete={props.onConfirmDeleteJob}
          onSelectPreviousJob={props.onSelectPreviousJob}
          onSelectNextJob={props.onSelectNextJob}
        />
        <DashboardDetailSection
          title={model.texts.detail}
          selectedJobLabel={model.texts.selectedJob}
          jobIdLabel={model.texts.jobId}
          projectLabel={model.texts.project}
          latestLogsLabel={model.texts.latestLogs}
          commandLabel={model.texts.command}
          argsLabel={model.texts.args}
          tagsLabel={model.texts.tags}
          statusLabel={model.texts.status}
          statusLabels={model.texts.statusLabels}
          startedAtLabel={model.texts.startedAt}
          finishedAtLabel={model.texts.finishedAt}
          durationLabel={model.texts.duration}
          errorLabel={model.texts.error}
          viewFullLabel={model.texts.viewFull}
          emptyLabel={model.texts.detailEmpty}
          logsEmptyLabel={model.texts.logsEmpty}
          isLoading={props.jobsUiState === "loading"}
          selectedJob={model.selectedJob}
        />
      </div>
    </section>
  );
}
