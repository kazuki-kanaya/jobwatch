// Responsibility: Compose dashboard sections into the final page layout using view-only props.
import DashboardDetailSection from "@/features/dashboard/components/DashboardDetailSection";
import DashboardFiltersSection from "@/features/dashboard/components/DashboardFiltersSection";
import DashboardHeaderSection from "@/features/dashboard/components/DashboardHeaderSection";
import DashboardJobsSection from "@/features/dashboard/components/DashboardJobsSection";
import DashboardSnapshotSection from "@/features/dashboard/components/DashboardSnapshotSection";
import type { DashboardViewModel } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardPageViewProps = {
  model: DashboardViewModel;
  jobsUiState: "ready" | "loading" | "empty" | "error";
};

export default function DashboardPageView({ model, jobsUiState }: DashboardPageViewProps) {
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
          updatedAtLabel={model.texts.updatedAt}
          refreshLabel={model.texts.refresh}
          alertRulesLabel={model.texts.alertRules}
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
          workspace={model.filters.workspace}
          host={model.filters.host}
          query={model.filters.query}
          title={model.texts.filters}
          applyLabel={model.texts.apply}
        />
        <section className={cn("grid gap-4 xl:grid-cols-[1.55fr_1fr]")}>
          <DashboardJobsSection
            jobs={model.jobs}
            uiState={jobsUiState}
            title={model.texts.recentJobs}
            emptyLabel={model.texts.noJobs}
            errorLabel={model.texts.jobsError}
            statusLabels={model.texts.statusLabels}
          />
          <DashboardDetailSection
            title={model.texts.detail}
            selectedJobLabel={model.texts.selectedJob}
            latestLogsLabel={model.texts.latestLogs}
          />
        </section>
      </div>
    </main>
  );
}
