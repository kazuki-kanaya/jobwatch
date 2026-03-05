import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceFormDialog } from "@/features/workspace/components/WorkspaceFormDialog/WorkspaceFormDialog";

const meta = {
  title: "Features/Workspace/WorkspaceFormDialog",
  component: WorkspaceFormDialog,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Create Workspace",
    description: "Create a new workspace scope.",
    workspaceNameLabel: "Workspace name",
    createLabel: "Create",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    workspaceDraftName: "",
    isEditing: false,
    isSubmitting: false,
    isOpen: true,
    onClose: () => {},
    onWorkspaceDraftNameChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof WorkspaceFormDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    title: "Edit Workspace",
    description: "Update workspace information.",
    workspaceDraftName: "Platform Infra",
    isEditing: true,
  },
};
