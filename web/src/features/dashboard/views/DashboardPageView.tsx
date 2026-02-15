// Responsibility: Compose dashboard sections into the final page layout using view-only props.
import DashboardDetailSection from "@/features/dashboard/components/DashboardDetailSection";
import DashboardFiltersSection from "@/features/dashboard/components/DashboardFiltersSection";
import DashboardHeaderSection from "@/features/dashboard/components/DashboardHeaderSection";
import DashboardJobsSection from "@/features/dashboard/components/DashboardJobsSection";
import DashboardSnapshotSection from "@/features/dashboard/components/DashboardSnapshotSection";
import DashboardManagementSection from "@/features/dashboard/views/DashboardManagementSection";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";
import DashboardWorkspaceSection from "@/features/dashboard/views/DashboardWorkspaceSection";
import { cn } from "@/lib/utils";

export default function DashboardPageView(props: DashboardPageViewProps) {
  const { model } = props;

  return (
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.14),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(251,191,36,0.12),transparent_32%),#020617] px-4 py-8 md:px-8",
      )}
    >
      <div className={cn("mx-auto grid w-full max-w-7xl gap-4")}>
        <DashboardHeaderSection
          title={model.title}
          subtitle={model.subtitle}
          updatedAt={model.snapshot.updatedAt}
          missionControlLabel={model.texts.missionControl}
          currentUserLabel={model.texts.currentUser}
          currentUserId={model.currentUser?.userId ?? "-"}
          currentUserName={model.currentUser?.name ?? "-"}
          updatedAtLabel={model.texts.updatedAt}
          refreshLabel={model.texts.refresh}
          signOutLabel={model.texts.signOut}
          alertRulesLabel={model.texts.alertRules}
          localeLabel={model.language.label}
          localeOptions={model.language.options}
          localeValue={model.language.current}
          onLocaleChange={props.onLocaleChange}
          onSignOut={props.onSignOut}
        />
        <DashboardSnapshotSection
          snapshot={model.snapshot}
          labels={{
            tracked: model.texts.snapshotTracked,
            running: model.texts.snapshotRunning,
            completed: model.texts.snapshotCompleted,
            failed: model.texts.snapshotFailed,
          }}
        />
        <DashboardFiltersSection
          workspaceLabel={model.filters.workspaceLabel}
          hostLabel={model.filters.hostLabel}
          queryLabel={model.filters.queryLabel}
          workspaceOptions={model.filters.workspaceOptions}
          hostOptions={model.filters.hostOptions}
          workspaceId={model.filters.workspaceId}
          hostId={model.filters.hostId}
          query={model.filters.query}
          title={model.texts.filters}
          applyLabel={model.texts.apply}
          onWorkspaceChange={props.onWorkspaceChange}
          onHostChange={props.onHostChange}
          onQueryChange={props.onQueryChange}
          onApply={props.onApplyFilters}
        />
        <DashboardWorkspaceSection model={model} workspaceManagement={props.workspaceManagement} />
        <DashboardManagementSection {...props} />
        <section className={cn("grid gap-4 xl:grid-cols-[1.55fr_1fr]")}>
          <DashboardJobsSection
            jobs={model.jobs}
            uiState={props.jobsUiState}
            title={model.texts.recentJobs}
            emptyLabel={model.texts.noJobs}
            errorLabel={model.texts.jobsError}
            jobIdLabel={model.texts.jobId}
            commandLabel={model.texts.command}
            argsLabel={model.texts.args}
            tagsLabel={model.texts.tags}
            startedAtLabel={model.texts.startedAt}
            finishedAtLabel={model.texts.finishedAt}
            durationLabel={model.texts.duration}
            statusLabels={model.texts.statusLabels}
            selectedJobId={props.selectedJobId}
            onSelectJob={props.onSelectJob}
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
            emptyLabel={model.texts.detailEmpty}
            logsEmptyLabel={model.texts.logsEmpty}
            selectedJob={model.selectedJob}
          />
        </section>
      </div>
    </main>
  );
}
