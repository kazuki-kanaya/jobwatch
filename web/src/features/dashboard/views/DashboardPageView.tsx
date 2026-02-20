import { lazy, Suspense, useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeaderSection from "@/features/dashboard/components/DashboardHeaderSection";
import DashboardSnapshotSection from "@/features/dashboard/components/DashboardSnapshotSection";
import DashboardWorkspaceContextCard from "@/features/dashboard/components/DashboardWorkspaceContextCard";
import DashboardWorkspaceTabs from "@/features/dashboard/components/DashboardWorkspaceTabs";
import type { DashboardPageViewProps } from "@/features/dashboard/views/DashboardPageView.types";
import DashboardWorkspaceSection from "@/features/dashboard/views/DashboardWorkspaceSection";
import { cn } from "@/lib/utils";

const DashboardOverviewTabSection = lazy(() => import("@/features/dashboard/views/DashboardOverviewTabSection"));
const DashboardMembersTabSection = lazy(() => import("@/features/dashboard/views/DashboardMembersTabSection"));

export default function DashboardPageView(props: DashboardPageViewProps) {
  const { model } = props;
  const [activeTab, setActiveTab] = useState<"overview" | "members">("overview");
  const [isTabPending, startTabTransition] = useTransition();
  const activeWorkspaceName =
    model.filters.workspaceOptions.find((workspace) => workspace.id === model.filters.workspaceId)?.name ?? "-";
  const showTabSkeleton = props.isWorkspaceSwitching || isTabPending;
  const handleTabChange = (nextTab: "overview" | "members") => {
    startTabTransition(() => {
      setActiveTab(nextTab);
    });
  };

  return (
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.12),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.08),transparent_28%),#030712] px-4 py-6 md:px-8",
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
          localeLabel={model.language.label}
          profileEditLabel={model.texts.profileEdit}
          profileNameLabel={model.texts.profileName}
          updateLabel={model.texts.edit}
          cancelLabel={model.texts.cancel}
          localeOptions={model.language.options}
          localeValue={model.language.current}
          isRefreshing={props.isRefreshing}
          isProfileDialogOpen={props.isUserProfileDialogOpen}
          profileDraftName={props.userProfileDraftName}
          isProfileSubmitting={props.isUserProfileSubmitting}
          onLocaleChange={props.onLocaleChange}
          onRefresh={props.onRefresh}
          onSignOut={props.onSignOut}
          onOpenProfileDialog={props.onOpenUserProfileDialog}
          onCloseProfileDialog={props.onCloseUserProfileDialog}
          onProfileDraftNameChange={props.onUserProfileDraftNameChange}
          onSubmitProfile={props.onSubmitUserProfile}
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

        <DashboardWorkspaceSection model={model} workspaceManagement={props.workspaceManagement} />

        <Card className={cn("border-cyan-400/35 bg-slate-950/65 py-0")}>
          <CardContent className={cn("space-y-4 px-4 py-4 md:px-5")}>
            <DashboardWorkspaceContextCard
              label={model.texts.currentWorkspace}
              name={activeWorkspaceName}
              hint={model.texts.workspaceScopeHint}
            />
            <DashboardWorkspaceTabs
              value={activeTab}
              overviewLabel={model.texts.tabOverview}
              membersLabel={model.texts.tabMembers}
              onChange={handleTabChange}
            />
            {showTabSkeleton ? (
              <DashboardTabSkeleton tab={activeTab} />
            ) : (
              <Suspense fallback={<DashboardTabSkeleton tab={activeTab} />}>
                {activeTab === "overview" ? <DashboardOverviewTabSection {...props} /> : null}
                {activeTab === "members" ? <DashboardMembersTabSection {...props} /> : null}
              </Suspense>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function DashboardTabSkeleton({ tab }: { tab: "overview" | "members" }) {
  if (tab === "members") {
    return (
      <section className={cn("grid gap-4 xl:grid-cols-2")}>
        <div className={cn("space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/80 p-4")}>
          <Skeleton className={cn("h-6 bg-slate-800")} />
          <Skeleton className={cn("h-14 bg-slate-800")} />
          <Skeleton className={cn("h-14 bg-slate-800")} />
          <Skeleton className={cn("h-14 bg-slate-800")} />
        </div>
        <div className={cn("space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/80 p-4")}>
          <Skeleton className={cn("h-6 bg-slate-800")} />
          <Skeleton className={cn("h-20 bg-slate-800")} />
          <Skeleton className={cn("h-20 bg-slate-800")} />
        </div>
      </section>
    );
  }

  return (
    <section className={cn("space-y-4")}>
      <div className={cn("space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/80 p-4")}>
        <Skeleton className={cn("h-6 bg-slate-800")} />
        <Skeleton className={cn("h-14 bg-slate-800")} />
        <Skeleton className={cn("h-14 bg-slate-800")} />
      </div>
      <div className={cn("grid gap-4 xl:grid-cols-[1.55fr_1fr]")}>
        <div className={cn("space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/80 p-4")}>
          <Skeleton className={cn("h-6 bg-slate-800")} />
          <Skeleton className={cn("h-24 bg-slate-800")} />
          <Skeleton className={cn("h-24 bg-slate-800")} />
          <Skeleton className={cn("h-24 bg-slate-800")} />
        </div>
        <div className={cn("space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/80 p-4")}>
          <Skeleton className={cn("h-6 bg-slate-800")} />
          <Skeleton className={cn("h-40 bg-slate-800")} />
          <Skeleton className={cn("h-32 bg-slate-800")} />
        </div>
      </div>
    </section>
  );
}
