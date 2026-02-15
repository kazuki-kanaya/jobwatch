// Responsibility: Render dashboard title and top-level call-to-action controls.
import { BellRing, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardHeaderSectionProps = {
  title: string;
  subtitle: string;
  updatedAt: string;
  missionControlLabel: string;
  updatedAtLabel: string;
  refreshLabel: string;
  alertRulesLabel: string;
};

export default function DashboardHeaderSection({
  title,
  subtitle,
  updatedAt,
  missionControlLabel,
  updatedAtLabel,
  refreshLabel,
  alertRulesLabel,
}: DashboardHeaderSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4 backdrop-blur")}>
      <CardContent className={cn("flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between")}>
        <div className={cn("space-y-1")}>
          <p className={cn("font-mono text-xs tracking-[0.2em] text-cyan-300 uppercase")}>{missionControlLabel}</p>
          <h1 className={cn("text-2xl font-semibold text-slate-100 md:text-3xl")}>{title}</h1>
          <p className={cn("text-sm text-slate-400")}>{subtitle}</p>
          <p className={cn("font-mono text-xs text-slate-500")}>
            {updatedAtLabel}: {updatedAt}
          </p>
        </div>
        <div className={cn("flex items-center gap-2")}>
          <Button variant="outline" className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}>
            <RefreshCw className={cn("size-4")} />
            {refreshLabel}
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
