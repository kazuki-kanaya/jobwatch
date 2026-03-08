import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderSection } from "@/features/header/components/HeaderSection/HeaderSection";

const meta = {
  title: "Features/Header/HeaderSection",
  component: HeaderSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    missionControlLabel: "MISSION CONTROL",
    title: "Obsern Control Deck",
    updatedAtLabel: "Last updated",
    updatedAtValue: "2026/03/08, 14:24 UTC",
    currentUserLabel: "Signed-in user",
    currentUserName: "no name",
    currentUserId: "ee5d9ac6-0930-441c-9f05-61c0427ad261",
    editProfileLabel: "Edit name",
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
    onEditProfile: () => {},
    onLocaleChange: () => {},
    onTimeZoneChange: () => {},
    onRefresh: () => {},
    onSignOut: () => {},
  },
} satisfies Meta<typeof HeaderSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Refreshing: Story = {
  args: {
    isRefreshing: true,
  },
};

export const Japanese: Story = {
  args: {
    missionControlLabel: "Mission Control",
    updatedAtLabel: "最終更新",
    updatedAtValue: "2026/03/08 23:24 JST",
    currentUserLabel: "ログイン中のユーザー",
    editProfileLabel: "名前を変更",
    languageLabel: "言語",
    refreshLabel: "更新",
    signOutLabel: "ログアウト",
    timeZoneLabel: "タイムゾーン",
    localeValue: "ja",
    localeOptions: [
      { id: "ja", name: "日本語" },
      { id: "en", name: "英語" },
    ],
    timeZoneValue: "Asia/Tokyo",
  },
};
