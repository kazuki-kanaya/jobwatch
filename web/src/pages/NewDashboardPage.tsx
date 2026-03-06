import { useState } from "react";
import { HostFeature } from "@/features/host";
import { WorkspaceFeature } from "@/features/workspace";
import { cn } from "@/lib/utils";

export default function NewDashboardPage() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

  return (
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.12),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.08),transparent_28%),#030712] px-4 py-6 md:px-8",
      )}
    >
      <div className={cn("mx-auto grid w-full max-w-7xl gap-4")}>
        <WorkspaceFeature workspaceId={selectedWorkspaceId} onWorkspaceIdChange={setSelectedWorkspaceId} />
        <HostFeature workspaceId={selectedWorkspaceId} />
      </div>
    </main>
  );
}
