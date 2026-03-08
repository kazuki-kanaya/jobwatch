import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostCreateButton } from "@/features/host/components/HostCreateButton/HostCreateButton";
import { HostSection } from "@/features/host/components/HostSection/HostSection";

const meta = {
  title: "Features/Host/HostSection",
  component: HostSection,
  args: {
    title: "Hosts",
    headerActions: (
      <HostCreateButton addLabel="Add" noPermissionLabel="No permission" canCreate={true} onCreateHost={() => {}} />
    ),
    content: (
      <div className="rounded-md border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-200">
        Host list slot
      </div>
    ),
  },
} satisfies Meta<typeof HostSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
