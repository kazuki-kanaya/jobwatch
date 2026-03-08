import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderProfileEditDialog } from "@/features/header/components/HeaderProfileEditDialog/HeaderProfileEditDialog";

const meta = {
  title: "Features/Header/HeaderProfileEditDialog",
  component: HeaderProfileEditDialog,
  args: {
    title: "Edit name",
    nameLabel: "Name",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    isOpen: true,
    draftName: "no name",
    isSubmitting: false,
    onClose: () => {},
    onDraftNameChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof HeaderProfileEditDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const EmptyName: Story = {
  args: {
    draftName: "",
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
