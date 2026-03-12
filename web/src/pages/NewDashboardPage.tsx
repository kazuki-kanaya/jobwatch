import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { HeaderFeature } from "@/features/header";
import { HostFeature } from "@/features/host";
import { InvitationManagementFeature } from "@/features/invitation";
import { JobFeature } from "@/features/job";
import { MemberFeature } from "@/features/member";
import { SnapshotFeature } from "@/features/snapshot";
import { useCurrentUser } from "@/features/user";
import { WorkspaceFeature } from "@/features/workspace";
import { cn } from "@/lib/utils";

export default function NewDashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [invitationCreateRequestKey, setInvitationCreateRequestKey] = useState(0);
  const accessToken = user?.access_token;
  const canAccessFeature = isAuthenticated && !isAuthLoading && Boolean(accessToken);
  const { currentUser } = useCurrentUser({
    accessToken,
    enabled: canAccessFeature,
  });

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
          onWorkspaceIdChange={setSelectedWorkspaceId}
        />
        <section
          className={cn(
            "rounded-[2rem] border border-slate-800/80 bg-slate-950/40 p-4 shadow-[0_20px_48px_rgba(2,6,23,0.3)] backdrop-blur-sm md:p-6",
          )}
        >
          <div className={cn("grid gap-4")}>
            <SnapshotFeature workspaceId={selectedWorkspaceId} />
            <HostFeature workspaceId={selectedWorkspaceId} currentUser={currentUser} />
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
            <JobFeature workspaceId={selectedWorkspaceId} currentUser={currentUser} />
          </div>
        </section>
      </div>
    </main>
  );
}
