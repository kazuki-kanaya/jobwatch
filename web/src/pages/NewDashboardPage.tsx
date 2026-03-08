import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { HeaderFeature } from "@/features/header";
import { HostFeature } from "@/features/host";
import { SnapshotFeature } from "@/features/snapshot";
import { useCurrentUser } from "@/features/user";
import { WorkspaceFeature } from "@/features/workspace";
import { cn } from "@/lib/utils";

export default function NewDashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
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
        <SnapshotFeature workspaceId={selectedWorkspaceId} />
        <HostFeature workspaceId={selectedWorkspaceId} currentUser={currentUser} />
      </div>
    </main>
  );
}
