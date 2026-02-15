// Responsibility: Provide visual regression stories for job list UI states.
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
        title: "train-llm-8b",
        workspace: "nlp-core",
        host: "gpu-a100-01",
        startedAt: "2026-02-15 09:10 UTC",
        status: "running",
      },
    ],
    uiState: "ready",
    title: "Recent Jobs",
    emptyLabel: "No jobs yet. Once the CLI sends a run, it will appear here.",
    errorLabel: "Failed to load jobs. Retry from refresh.",
    statusLabels: {
      running: "running",
      completed: "completed",
      failed: "failed",
      queued: "queued",
    },
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
