import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobDetail } from "@/features/job/components/JobDetail/JobDetail";

const selectedJob = {
  id: "job-fc2a7a37",
  workspaceId: "workspace-6876ae4f",
  hostId: "host-92cba371",
  hostName: "gpu-server-1",
  startedAtIso: "2026-03-08T09:38:00.000Z",
  command: "python train_model.py --epochs 20",
  tags: ["monitoring", "cli", "testing"],
  status: "failed" as const,
  startedAt: "2026/03/08 09:38 UTC",
  finishedAt: "2026/03/08 09:39 UTC",
  duration: "20s",
  logs: [
    "Start training: epochs=20",
    "epoch 1/20 loss=1.8214 acc=0.1393",
    "epoch 2/20 loss=1.5816 acc=0.2592",
    "ERROR: training aborted",
  ],
};

const meta = {
  title: "Features/Job/JobDetail",
  component: JobDetail,
  args: {
    selectedJob,
    title: "Detail",
    selectedJobLabel: "Selected Job",
    emptyLabel: "Select a job from list.",
    statusLabel: "Failed",
    logsEmptyLabel: "No logs.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    labels: {
      jobId: "Job ID",
      hostId: "Host ID",
      status: "Status",
      tags: "Tags",
      startedAt: "Started At",
      finishedAt: "Finished At",
      duration: "Duration",
      latestLogs: "Latest Logs",
      viewFull: "View full",
    },
  },
} satisfies Meta<typeof JobDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Empty: Story = {
  args: {
    selectedJob: null,
    statusLabel: null,
  },
};

export const WithoutError: Story = {
  args: {
    selectedJob: {
      ...selectedJob,
      status: "completed",
      logs: ["job completed"],
    },
    statusLabel: "Completed",
  },
};
