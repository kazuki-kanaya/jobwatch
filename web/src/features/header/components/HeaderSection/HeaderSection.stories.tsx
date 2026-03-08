import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderBrand } from "@/features/header/components/HeaderBrand/HeaderBrand";
import { HeaderControls } from "@/features/header/components/HeaderControls/HeaderControls";
import { HeaderProfileEditDialog } from "@/features/header/components/HeaderProfileEditDialog/HeaderProfileEditDialog";
import { HeaderSection } from "@/features/header/components/HeaderSection/HeaderSection";
import { HeaderUserCard } from "@/features/header/components/HeaderUserCard/HeaderUserCard";

const localeOptions = [
  { id: "en", name: "English" },
  { id: "ja", name: "Japanese" },
];

const timeZoneOptions = [
  { id: "Asia/Tokyo", name: "JST" },
  { id: "UTC", name: "UTC" },
] as const;

const meta = {
  title: "Features/Header/HeaderSection",
  component: HeaderSection,
  parameters: {
    layout: "padded",
    backgrounds: { default: "dark" },
  },
  args: {
    brand: (
      <HeaderBrand
        missionControlLabel="MISSION CONTROL"
        title="Obsern Control Deck"
        updatedAtLabel="Last updated"
        updatedAtValue="2026/03/08, 14:24 UTC"
      />
    ),
    userCard: (
      <HeaderUserCard
        currentUserLabel="Signed-in user"
        currentUserName="no name"
        currentUserId="ee5d9ac6-0930-441c-9f05-61c0427ad261"
        editProfileLabel="Edit name"
        onEditProfile={() => {}}
      />
    ),
    controls: (
      <HeaderControls
        languageLabel="Language"
        refreshLabel="Refresh"
        signOutLabel="Sign out"
        timeZoneLabel="Time zone"
        localeValue="en"
        localeOptions={localeOptions}
        timeZoneValue="UTC"
        timeZoneOptions={[...timeZoneOptions]}
        isRefreshing={false}
        isSigningOut={false}
        onLocaleChange={() => {}}
        onTimeZoneChange={() => {}}
        onRefresh={() => {}}
        onSignOut={() => {}}
      />
    ),
    profileDialog: (
      <HeaderProfileEditDialog
        title="Edit name"
        nameLabel="Name"
        updateLabel="Update"
        cancelLabel="Cancel"
        isOpen={false}
        draftName="no name"
        isSubmitting={false}
        onClose={() => {}}
        onDraftNameChange={() => {}}
        onSubmit={() => {}}
      />
    ),
  },
} satisfies Meta<typeof HeaderSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Refreshing: Story = {
  args: {
    controls: (
      <HeaderControls
        languageLabel="Language"
        refreshLabel="Refresh"
        signOutLabel="Sign out"
        timeZoneLabel="Time zone"
        localeValue="en"
        localeOptions={localeOptions}
        timeZoneValue="UTC"
        timeZoneOptions={[...timeZoneOptions]}
        isRefreshing
        isSigningOut={false}
        onLocaleChange={() => {}}
        onTimeZoneChange={() => {}}
        onRefresh={() => {}}
        onSignOut={() => {}}
      />
    ),
  },
};

export const Japanese: Story = {
  args: {
    brand: (
      <HeaderBrand
        missionControlLabel="Mission Control"
        title="Obsern Control Deck"
        updatedAtLabel="最終更新"
        updatedAtValue="2026/03/08 23:24 JST"
      />
    ),
    userCard: (
      <HeaderUserCard
        currentUserLabel="ログイン中のユーザー"
        currentUserName="no name"
        currentUserId="ee5d9ac6-0930-441c-9f05-61c0427ad261"
        editProfileLabel="名前を変更"
        onEditProfile={() => {}}
      />
    ),
    controls: (
      <HeaderControls
        languageLabel="言語"
        refreshLabel="更新"
        signOutLabel="ログアウト"
        timeZoneLabel="タイムゾーン"
        localeValue="ja"
        localeOptions={[
          { id: "ja", name: "日本語" },
          { id: "en", name: "英語" },
        ]}
        timeZoneValue="Asia/Tokyo"
        timeZoneOptions={[...timeZoneOptions]}
        isRefreshing={false}
        isSigningOut={false}
        onLocaleChange={() => {}}
        onTimeZoneChange={() => {}}
        onRefresh={() => {}}
        onSignOut={() => {}}
      />
    ),
    profileDialog: (
      <HeaderProfileEditDialog
        title="名前を変更"
        nameLabel="名前"
        updateLabel="更新"
        cancelLabel="キャンセル"
        isOpen={false}
        draftName="no name"
        isSubmitting={false}
        onClose={() => {}}
        onDraftNameChange={() => {}}
        onSubmit={() => {}}
      />
    ),
  },
};

export const ProfileDialogOpen: Story = {
  args: {
    profileDialog: (
      <HeaderProfileEditDialog
        title="Edit name"
        nameLabel="Name"
        updateLabel="Update"
        cancelLabel="Cancel"
        isOpen
        draftName="no name"
        isSubmitting={false}
        onClose={() => {}}
        onDraftNameChange={() => {}}
        onSubmit={() => {}}
      />
    ),
  },
};
