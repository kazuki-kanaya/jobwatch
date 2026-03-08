import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderBrand } from "@/features/header/components/HeaderBrand/HeaderBrand";

const meta = {
  title: "Features/Header/HeaderBrand",
  component: HeaderBrand,
  args: {
    missionControlLabel: "MISSION CONTROL",
    title: "Obsern Control Deck",
    updatedAtLabel: "Last updated",
    updatedAtValue: "2026/03/08, 14:24 UTC",
  },
} satisfies Meta<typeof HeaderBrand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Japanese: Story = {
  args: {
    updatedAtLabel: "最終更新",
    updatedAtValue: "2026/03/08 23:24 JST",
  },
};
