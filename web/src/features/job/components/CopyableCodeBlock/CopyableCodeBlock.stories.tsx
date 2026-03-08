import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyableCodeBlock } from "@/features/job/components/CopyableCodeBlock/CopyableCodeBlock";

const meta = {
  title: "Features/Job/CopyableCodeBlock",
  component: CopyableCodeBlock,
  args: {
    content: "line 1\nline 2\nline 3",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    copied: false,
    onCopy: () => {},
  },
} satisfies Meta<typeof CopyableCodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Copied: Story = {
  args: {
    copied: true,
  },
};

export const Disabled: Story = {
  args: {
    isCopyDisabled: true,
  },
};
