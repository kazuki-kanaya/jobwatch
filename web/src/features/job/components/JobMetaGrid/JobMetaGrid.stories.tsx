import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobMetaGrid } from "@/features/job/components/JobMetaGrid/JobMetaGrid";

const meta = {
  title: "Features/Job/JobMetaGrid",
  component: JobMetaGrid,
  args: {
    statusLabel: "Failed",
    labels: {
      project: "Project",
      status: "Status",
      duration: "Duration",
      startedAt: "Started At",
      finishedAt: "Finished At",
      command: "Command",
      jobId: "Job ID",
      args: "Args",
      tags: "Tags",
    },
    selectedJob: {
      id: "job-fc2a7a37",
      project: "my_project",
      workspaceId: "workspace-6876ae4f",
      hostId: "host-92cba371",
      startedAtIso: "2026-03-08T09:38:00.000Z",
      fullCommand: "python train_model.py --epochs 20",
      command: "python",
      args: ["train_model.py", "--epochs", "20"],
      tags: ["monitoring", "cli", "testing"],
      status: "failed",
      startedAt: "2026/03/08 09:38 UTC",
      finishedAt: "2026/03/08 09:39 UTC",
      duration: "20s",
      errorMessage: "exit status 1",
      logs: ["Start training: epochs=20"],
    },
  },
} satisfies Meta<typeof JobMetaGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
