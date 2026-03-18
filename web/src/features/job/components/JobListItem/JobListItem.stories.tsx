import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobListItem } from "@/features/job/components/JobListItem/JobListItem";

const meta = {
  title: "Features/Job/JobListItem",
  component: JobListItem,
  args: {
    job: {
      id: "job-fc2a7a37",
      workspaceId: "workspace-6876ae4f",
      hostId: "host-92cba371",
      startedAtIso: "2026-03-08T09:38:00.000Z",
      command: "python train_model.py --epochs 20",
      tags: ["monitoring", "cli", "testing"],
      status: "failed",
      startedAt: "2026/03/08 09:38 UTC",
      finishedAt: "2026/03/08 09:39 UTC",
      duration: "20s",
      logs: ["Start training: epochs=20"],
    },
    isSelected: true,
    canManage: true,
    deleteLabel: "Delete",
    statusLabel: "Failed",
    startedAtLabel: "Started At",
    durationLabel: "Duration",
    onSelect: () => {},
    onDelete: () => {},
  },
} satisfies Meta<typeof JobListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const NotSelected: Story = {
  args: {
    isSelected: false,
  },
};

export const ReadOnly: Story = {
  args: {
    canManage: false,
  },
};
