// Responsibility: Provide visual regression stories for dashboard header including language switch states.
import type { Meta, StoryObj } from "@storybook/react-vite";
import DashboardHeaderSection from "@/features/dashboard/components/DashboardHeaderSection";

const meta = {
  title: "Features/Dashboard/DashboardHeaderSection",
  component: DashboardHeaderSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    title: "Jobwatch Control Deck",
    subtitle: "GPU server jobs at a glance, with fast anomaly spotting.",
    updatedAt: "02/16/2026, 09:41 AM",
    missionControlLabel: "mission control",
    currentUserLabel: "Current user",
    currentUserId: "user-001",
    currentUserName: "kazu",
    updatedAtLabel: "Last sync",
    refreshLabel: "Refresh",
    signOutLabel: "Sign out",
    alertRulesLabel: "Alert Rules",
    localeLabel: "Language",
    profileEditLabel: "Edit name",
    profileNameLabel: "Name",
    updateLabel: "Update",
    cancelLabel: "Cancel",
    localeValue: "en",
    isRefreshing: false,
    isProfileDialogOpen: false,
    profileDraftName: "kazu",
    isProfileSubmitting: false,
    localeOptions: [
      { id: "en", name: "English" },
      { id: "ja", name: "Japanese" },
    ],
    onOpenProfileDialog: () => {},
    onCloseProfileDialog: () => {},
    onProfileDraftNameChange: () => {},
    onSubmitProfile: () => {},
    onRefresh: () => {},
    onLocaleChange: () => {},
    onSignOut: () => {},
  },
} satisfies Meta<typeof DashboardHeaderSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Japanese: Story = {
  args: {
    title: "Jobwatch コントロールデッキ",
    subtitle: "GPUサーバーのジョブ状況を素早く俯瞰できます。",
    updatedAt: "2026/02/16 09:41",
    missionControlLabel: "監視モード",
    currentUserLabel: "現在のユーザー",
    currentUserId: "user-001",
    currentUserName: "kazu",
    updatedAtLabel: "最終同期",
    refreshLabel: "更新",
    signOutLabel: "ログアウト",
    alertRulesLabel: "アラート設定",
    localeLabel: "言語",
    profileEditLabel: "名前を変更",
    profileNameLabel: "名前",
    updateLabel: "更新",
    cancelLabel: "キャンセル",
    localeValue: "ja",
    localeOptions: [
      { id: "en", name: "英語" },
      { id: "ja", name: "日本語" },
    ],
  },
};
