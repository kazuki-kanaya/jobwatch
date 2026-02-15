// Responsibility: Render dashboard title and top-level call-to-action controls.
import { BellRing, Languages, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DashboardSelectOption } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardHeaderSectionProps = {
  title: string;
  subtitle: string;
  updatedAt: string;
  missionControlLabel: string;
  currentUserLabel: string;
  currentUserId: string;
  currentUserName: string;
  updatedAtLabel: string;
  refreshLabel: string;
  signOutLabel: string;
  alertRulesLabel: string;
  localeLabel: string;
  localeOptions: DashboardSelectOption[];
  localeValue: string;
  onLocaleChange: (locale: string) => void;
  onSignOut: () => void;
};

export default function DashboardHeaderSection({
  title,
  subtitle,
  updatedAt,
  missionControlLabel,
  currentUserLabel,
  currentUserId,
  currentUserName,
  updatedAtLabel,
  refreshLabel,
  signOutLabel,
  alertRulesLabel,
  localeLabel,
  localeOptions,
  localeValue,
  onLocaleChange,
  onSignOut,
}: DashboardHeaderSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4 backdrop-blur")}>
      <CardContent className={cn("flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between")}>
        <div className={cn("space-y-1")}>
          <p className={cn("font-mono text-xs tracking-[0.2em] text-cyan-300 uppercase")}>{missionControlLabel}</p>
          <h1 className={cn("text-2xl font-semibold text-slate-100 md:text-3xl")}>{title}</h1>
          <p className={cn("text-sm text-slate-400")}>{subtitle}</p>
          <p className={cn("text-xs text-slate-400")}>
            {currentUserLabel}: {currentUserName} ({currentUserId})
          </p>
          <p className={cn("font-mono text-xs text-slate-500")}>
            {updatedAtLabel}: {updatedAt}
          </p>
        </div>
        <div className={cn("flex items-center gap-2")}>
          <div className={cn("space-y-1")}>
            <span className={cn("sr-only")}>{localeLabel}</span>
            <div className={cn("flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-2")}>
              <Languages className={cn("size-4 text-slate-300")} />
              <Select value={localeValue} onValueChange={onLocaleChange}>
                <SelectTrigger
                  id="dashboard-language"
                  className={cn(
                    "h-9 min-w-32 border-none bg-slate-800 text-slate-100 shadow-none focus-visible:ring-0",
                  )}
                >
                  <SelectValue placeholder={localeLabel} />
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
          </div>
          <Button variant="outline" className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}>
            <RefreshCw className={cn("size-4")} />
            {refreshLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSignOut}
            className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            <LogOut className={cn("size-4")} />
            {signOutLabel}
          </Button>
          <Button className={cn("bg-cyan-500 text-slate-950 hover:bg-cyan-400")}>
            <BellRing className={cn("size-4")} />
            {alertRulesLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
