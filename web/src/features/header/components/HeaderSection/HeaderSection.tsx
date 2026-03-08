import { Card, CardContent } from "@/components/ui/card";
import { HeaderBrand } from "@/features/header/components/HeaderBrand/HeaderBrand";
import { HeaderControls } from "@/features/header/components/HeaderControls/HeaderControls";
import { HeaderUserCard } from "@/features/header/components/HeaderUserCard/HeaderUserCard";
import type { HeaderSectionProps } from "@/features/header/components/types";
import { cn } from "@/lib/utils";

export function HeaderSection({
  missionControlLabel,
  title,
  updatedAtLabel,
  updatedAtValue,
  currentUserLabel,
  currentUserName,
  currentUserId,
  editProfileLabel,
  languageLabel,
  refreshLabel,
  signOutLabel,
  timeZoneLabel,
  localeValue,
  localeOptions,
  timeZoneValue,
  timeZoneOptions,
  isRefreshing,
  isSigningOut,
  onEditProfile,
  onLocaleChange,
  onTimeZoneChange,
  onRefresh,
  onSignOut,
}: HeaderSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4 backdrop-blur")}>
      <CardContent className={cn("flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between")}>
        <HeaderBrand
          missionControlLabel={missionControlLabel}
          title={title}
          updatedAtLabel={updatedAtLabel}
          updatedAtValue={updatedAtValue}
        />
        <div className={cn("flex w-full flex-col items-start gap-3 md:w-auto md:items-end")}>
          <HeaderUserCard
            currentUserLabel={currentUserLabel}
            currentUserName={currentUserName}
            currentUserId={currentUserId}
            editProfileLabel={editProfileLabel}
            onEditProfile={onEditProfile}
          />
          <HeaderControls
            languageLabel={languageLabel}
            refreshLabel={refreshLabel}
            signOutLabel={signOutLabel}
            timeZoneLabel={timeZoneLabel}
            localeValue={localeValue}
            localeOptions={localeOptions}
            timeZoneValue={timeZoneValue}
            timeZoneOptions={timeZoneOptions}
            isRefreshing={isRefreshing}
            isSigningOut={isSigningOut}
            onLocaleChange={onLocaleChange}
            onTimeZoneChange={onTimeZoneChange}
            onRefresh={onRefresh}
            onSignOut={onSignOut}
          />
        </div>
      </CardContent>
    </Card>
  );
}
