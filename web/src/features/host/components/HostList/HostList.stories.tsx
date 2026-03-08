import type { Meta, StoryObj } from "@storybook/react-vite";
import { HostList } from "@/features/host/components/HostList/HostList";

const items = [
  { id: "host_001", name: "runner-tokyo-01" },
  { id: "host_002", name: "runner-tokyo-02" },
];

const meta = {
  title: "Features/Host/HostList",
  component: HostList,

  args: {
    items,
    isLoading: false,
    isError: false,
    emptyLabel: "No hosts yet.",
    errorLabel: "Failed to load hosts.",
    editLabel: "Edit",
    deleteLabel: "Delete",
    canManage: true,
    onEditHost: () => {},
    onDeleteHost: () => {},
  },
} satisfies Meta<typeof HostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
