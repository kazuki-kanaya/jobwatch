import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderControls } from "@/features/header/components/HeaderControls/HeaderControls";

const meta = {
  title: "Features/Header/HeaderControls",
  component: HeaderControls,
  args: {
    languageLabel: "Language",
    refreshLabel: "Refresh",
    signOutLabel: "Sign out",
    timeZoneLabel: "Time zone",
    localeValue: "en",
    localeOptions: [
      { id: "en", name: "English" },
      { id: "ja", name: "Japanese" },
    ],
    timeZoneValue: "UTC",
    timeZoneOptions: [
      { id: "Asia/Tokyo", name: "JST" },
      { id: "UTC", name: "UTC" },
    ],
    isRefreshing: false,
    isSigningOut: false,
    onLocaleChange: () => {},
    onTimeZoneChange: () => {},
    onRefresh: () => {},
    onSignOut: () => {},
  },
} satisfies Meta<typeof HeaderControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Refreshing: Story = {
  args: {
    isRefreshing: true,
  },
};

export const SigningOut: Story = {
  args: {
    isSigningOut: true,
    localeValue: "ja",
    languageLabel: "言語",
    refreshLabel: "更新",
    signOutLabel: "ログアウト",
    timeZoneLabel: "タイムゾーン",
    localeOptions: [
      { id: "ja", name: "日本語" },
      { id: "en", name: "英語" },
    ],
    timeZoneValue: "Asia/Tokyo",
  },
};
