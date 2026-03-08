import { Languages, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HeaderLocaleOption, HeaderTimeZone, HeaderTimeZoneOption } from "@/features/header/components/types";
import { cn } from "@/lib/utils";

type HeaderControlsProps = {
  languageLabel: string;
  refreshLabel: string;
  signOutLabel: string;
  timeZoneLabel: string;
  localeValue: string;
  localeOptions: HeaderLocaleOption[];
  timeZoneValue: HeaderTimeZone;
  timeZoneOptions: HeaderTimeZoneOption[];
  isRefreshing: boolean;
  isSigningOut: boolean;
  onLocaleChange: (locale: string) => void;
  onTimeZoneChange: (timeZone: HeaderTimeZone) => void;
  onRefresh: () => Promise<void> | void;
  onSignOut: () => Promise<void> | void;
};

export function HeaderControls({
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
  onLocaleChange,
  onTimeZoneChange,
  onRefresh,
  onSignOut,
}: HeaderControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2")}>
      <div className={cn("flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-2")}>
        <Languages className={cn("size-4 text-slate-300")} />
        <Select value={localeValue} onValueChange={onLocaleChange}>
          <SelectTrigger
            aria-label={languageLabel}
            className={cn("h-9 min-w-28 border-none bg-transparent text-slate-100 shadow-none focus-visible:ring-0")}
          >
            <SelectValue placeholder={languageLabel} />
          </SelectTrigger>
          <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
            {localeOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={cn("rounded-md border border-slate-600 bg-slate-800 px-2")}>
        <Select value={timeZoneValue} onValueChange={(value) => onTimeZoneChange(value as HeaderTimeZone)}>
          <SelectTrigger
            aria-label={timeZoneLabel}
            className={cn("h-9 min-w-20 border-none bg-transparent text-slate-100 shadow-none focus-visible:ring-0")}
          >
            <SelectValue placeholder={timeZoneLabel} />
          </SelectTrigger>
          <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
            {timeZoneOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onRefresh}
        disabled={isRefreshing}
        className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
      >
        <RefreshCw className={cn("size-4", isRefreshing ? "animate-spin" : "")} />
        {refreshLabel}
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={onSignOut}
        disabled={isSigningOut}
        className={cn("cursor-pointer bg-rose-700 text-white hover:bg-rose-600")}
      >
        <LogOut className={cn("size-4")} />
        {signOutLabel}
      </Button>
    </div>
  );
}
