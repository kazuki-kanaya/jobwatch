import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobListItemMenu } from "@/features/job/components/JobListItemMenu/JobListItemMenu";

const meta = {
  title: "Features/Job/JobListItemMenu",
  component: JobListItemMenu,
  args: {
    jobId: "job-fc2a7a37",
    canManage: true,
    deleteLabel: "Delete",
    onDeleteJob: () => {},
  },
} satisfies Meta<typeof JobListItemMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const ReadOnly: Story = {
  args: {
    canManage: false,
  },
};
