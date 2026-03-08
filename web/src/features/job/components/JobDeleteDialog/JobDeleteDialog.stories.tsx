import type { Meta, StoryObj } from "@storybook/react-vite";
import { JobDeleteDialog } from "@/features/job/components/JobDeleteDialog/JobDeleteDialog";

const meta = {
  title: "Features/Job/JobDeleteDialog",
  component: JobDeleteDialog,
  args: {
    title: "Delete job",
    description: "This action cannot be undone.",
    cancelLabel: "Cancel",
    deleteLabel: "Delete",
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof JobDeleteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
