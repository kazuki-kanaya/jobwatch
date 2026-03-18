import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobList } from "@/features/job/components/JobList/JobList";

const baseJobs = [
  {
    id: "job-fc2a7a37",
    workspaceId: "workspace-6876ae4f",
    hostId: "host-92cba371",
    startedAtIso: "2026-03-08T09:38:00.000Z",
    command: "python train_model.py --epochs 20",
    tags: ["monitoring", "cli", "testing"],
    status: "failed" as const,
    startedAt: "2026/03/08 09:38 UTC",
    finishedAt: "2026/03/08 09:39 UTC",
    duration: "20s",
    logs: ["Start training: epochs=20"],
  },
  {
    id: "job-ab12cd34",
    workspaceId: "workspace-6876ae4f",
    hostId: "host-92cba371",
    startedAtIso: "2026-03-08T08:10:00.000Z",
    command: "node dist/index.js --sync",
    tags: ["batch"],
    status: "completed" as const,
    startedAt: "2026/03/08 08:10 UTC",
    finishedAt: "2026/03/08 08:11 UTC",
    duration: "1m 3s",
    logs: ["job completed"],
  },
];

const meta = {
  title: "Features/Job/JobList",
  component: JobList,
  args: {
    jobs: baseJobs,
    state: "ready",
    selectedJobId: "job-fc2a7a37",
    emptyLabel: "No jobs yet.",
    errorLabel: "Failed to load jobs.",
    deleteLabel: "Delete",
    canManage: true,
    startedAtLabel: "Started At",
    durationLabel: "Duration",
    statusLabels: {
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      canceled: "Canceled",
    },
    onSelectJob: () => {},
    onDeleteJob: () => {},
  },
} satisfies Meta<typeof JobList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    state: "loading",
  },
};

export const EmptyState: Story = {
  args: {
    state: "empty",
    jobs: [],
  },
};

export const ErrorState: Story = {
  args: {
    state: "error",
  },
};
