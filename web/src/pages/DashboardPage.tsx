import { useCallback, useState } from "react";
import { useAuth } from "react-oidc-context";
import { HeaderFeature } from "@/features/header";
import { HostFeature } from "@/features/host";
import { InvitationManagementFeature } from "@/features/invitation";
import { JobFeature } from "@/features/job";
import { MemberFeature } from "@/features/member";
import { SnapshotFeature } from "@/features/snapshot";
import { useCurrentUser } from "@/features/user";
import { WorkspaceFeature } from "@/features/workspace";
import { WorkspaceContentTabs } from "@/features/workspace/components/WorkspaceContentTabs/WorkspaceContentTabs";
import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader/WorkspaceHeader";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState("-");
  const [invitationCreateRequestKey, setInvitationCreateRequestKey] = useState(0);
  const { t } = useLocale();
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);
  const { currentUser } = useCurrentUser({
    accessToken,
    enabled: canAccessFeature,
  });
  const handleWorkspaceChange = useCallback(
    ({ workspaceId, workspaceName }: { workspaceId: string; workspaceName: string }) => {
      setSelectedWorkspaceId(workspaceId === "-" ? "" : workspaceId);
      setSelectedWorkspaceName(workspaceName);
    },
    [],
  );

  return (
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.12),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.08),transparent_28%),#030712] px-4 py-6 md:px-8",
      )}
    >
      <div className={cn("mx-auto grid w-full max-w-7xl gap-4")}>
        <HeaderFeature currentUser={currentUser} />
        <WorkspaceFeature
          workspaceId={selectedWorkspaceId}
          currentUser={currentUser}
          onWorkspaceChange={handleWorkspaceChange}
        />
        <WorkspaceContentTabs
          hint={t("dashboard_workspace_scope_hint")}
          workspaceHeader={
            <WorkspaceHeader
              title={t("dashboard_current_workspace")}
              workspaceId={selectedWorkspaceId || "-"}
              workspaceName={selectedWorkspaceName}
            />
          }
          snapshot={<SnapshotFeature workspaceId={selectedWorkspaceId} />}
          operationsLabel={t("dashboard_tab_operations")}
          peopleLabel={t("dashboard_tab_people")}
          operationsContent={
            <div className={cn("grid gap-4")}>
              <HostFeature workspaceId={selectedWorkspaceId} currentUser={currentUser} />
              <JobFeature workspaceId={selectedWorkspaceId} currentUser={currentUser} />
            </div>
          }
          peopleContent={
            <div className={cn("grid gap-4 xl:grid-cols-[1fr_1fr]")}>
              <MemberFeature
                workspaceId={selectedWorkspaceId}
                currentUser={currentUser}
                onRequestCreateInvitation={() => setInvitationCreateRequestKey((prev) => prev + 1)}
              />
              <InvitationManagementFeature
                workspaceId={selectedWorkspaceId}
                currentUser={currentUser}
                createDialogRequestKey={invitationCreateRequestKey}
              />
            </div>
          }
        />
      </div>
    </main>
  );
}
