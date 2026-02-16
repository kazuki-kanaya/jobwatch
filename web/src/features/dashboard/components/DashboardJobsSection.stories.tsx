import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardJobsSection from "@/features/dashboard/components/DashboardJobsSection";

const meta = {
  title: "Features/Dashboard/DashboardJobsSection",
  component: DashboardJobsSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    jobs: [
      {
        id: "job-001",
        jobId: "job-001",
        workspaceId: "ws-001",
        hostId: "h1",
        title: "train-llm-8b",
        project: "train-llm-8b",
        workspace: "nlp-core",
        host: "gpu-a100-01",
        startedAtIso: "2026-02-15T09:10:00Z",
        finishedAtIso: null,
        startedAt: "2026-02-15 09:10 UTC",
        finishedAt: null,
        duration: "6m 10s",
        status: "running",
        command: "python train.py --config base.yaml",
        args: ["--config", "base.yaml"],
        tags: ["nightly", "llm"],
        errorMessage: null,
        tailLines: ["[INFO] epoch=1", "[INFO] lr=1e-4"],
      },
    ],
    uiState: "ready",
    title: "Recent Jobs",
    emptyLabel: "No jobs yet. Once the CLI sends a run, it will appear here.",
    errorLabel: "Failed to load jobs. Retry from refresh.",
    jobIdLabel: "Job ID",
    projectLabel: "Project",
    workspaceLabel: "Workspace",
    hostLabel: "Host",
    tagsLabel: "Tags",
    startedAtLabel: "Started",
    finishedAtLabel: "Finished",
    durationLabel: "Duration",
    cancelLabel: "Cancel",
    deleteLabel: "Delete",
    noPermissionLabel: "No permission",
    deleteConfirmTitle: "Delete job?",
    deleteConfirmDescription: "This action cannot be undone.",
    canManage: true,
    pendingDeleteJobId: null,
    isSubmittingDelete: false,
    selectedJobId: "job-001",
    statusLabels: {
      running: "running",
      completed: "completed",
      failed: "failed",
      canceled: "canceled",
    },
    onSelectJob: () => {},
    onRequestDelete: () => {},
    onCancelDelete: () => {},
    onConfirmDelete: () => {},
    onSelectPreviousJob: () => {},
    onSelectNextJob: () => {},
  },
} satisfies Meta<typeof DashboardJobsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    jobs: [],
    uiState: "empty",
  },
};

export const Loading: Story = {
  args: {
    jobs: [],
    uiState: "loading",
  },
};
