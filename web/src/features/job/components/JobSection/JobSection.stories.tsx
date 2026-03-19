import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobDetail } from "@/features/job/components/JobDetail/JobDetail";
import { JobList } from "@/features/job/components/JobList/JobList";
import { JobSection } from "@/features/job/components/JobSection/JobSection";

const jobs = [
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
    logs: ["Start training: epochs=20", "ERROR: training aborted"],
  },
];

const meta = {
  title: "Features/Job/JobSection",
  component: JobSection,
  args: {
    title: "Recent Jobs",
    list: (
      <JobList
        jobs={jobs}
        state="ready"
        selectedJobId="job-fc2a7a37"
        emptyLabel="No jobs yet."
        errorLabel="Failed to load jobs."
        deleteLabel="Delete"
        canManage={true}
        startedAtLabel="Started At"
        durationLabel="Duration"
        statusLabels={{
          running: "Running",
          completed: "Completed",
          failed: "Failed",
          canceled: "Canceled",
        }}
        onSelectJob={() => {}}
        onDeleteJob={() => {}}
      />
    ),
    detail: (
      <JobDetail
        selectedJob={jobs[0]}
        title="Detail"
        selectedJobLabel="Selected Job"
        emptyLabel="Select a job from list."
        statusLabel="Failed"
        logsEmptyLabel="No logs."
        copyLabel="Copy"
        copiedLabel="Copied"
        labels={{
          jobId: "Job ID",
          status: "Status",
          tags: "Tags",
          startedAt: "Started At",
          finishedAt: "Finished At",
          duration: "Duration",
          latestLogs: "Latest Logs",
          viewFull: "View full",
        }}
      />
    ),
    dialogs: null,
  },
} satisfies Meta<typeof JobSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
