import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceCreateButton } from "@/features/workspace/components/WorkspaceCreateButton/WorkspaceCreateButton";
import { WorkspaceHeader } from "@/features/workspace/components/WorkspaceHeader/WorkspaceHeader";
import { WorkspaceSection } from "@/features/workspace/components/WorkspaceSection/WorkspaceSection";

const meta = {
  title: "Features/Workspace/WorkspaceSection",
  component: WorkspaceSection,
  args: {
    title: "Workspaces",
    headerActions: (
      <WorkspaceCreateButton
        addLabel="Create"
        noPermissionLabel="No permission"
        canCreate={true}
        onCreateWorkspace={() => {}}
      />
    ),
    summary: (
      <WorkspaceHeader
        title="Current Workspace"
        workspaceName="Platform Infra"
        workspaceId="workspace-111111"
        hint="Scope for hosts, jobs, and members."
      />
    ),
    content: (
      <div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-200">
        Workspace list slot
      </div>
    ),
  },
} satisfies Meta<typeof WorkspaceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
