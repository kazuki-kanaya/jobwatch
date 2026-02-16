// Responsibility: Render KPI snapshot cards for quick status overview.
import { Activity, CheckCircle2, ServerCrash, TimerReset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardSnapshot } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardSnapshotSectionProps = {
  snapshot: DashboardSnapshot;
  labels: {
    tracked: string;
    running: string;
    completed: string;
    failed: string;
  };
};

export default function DashboardSnapshotSection({ snapshot, labels }: DashboardSnapshotSectionProps) {
  const cards = [
    { key: "total", label: labels.tracked, icon: Activity, color: "text-slate-200" },
    { key: "running", label: labels.running, icon: TimerReset, color: "text-cyan-200" },
    { key: "completed", label: labels.completed, icon: CheckCircle2, color: "text-emerald-200" },
    { key: "failed", label: labels.failed, icon: ServerCrash, color: "text-rose-200" },
  ] as const;

  return (
    <section className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4")}>
      {cards.map((item) => {
        const value = snapshot[item.key];
        const Icon = item.icon;

        return (
          <Card key={item.key} className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
            <CardContent className={cn("flex items-center justify-between px-4")}>
              <div>
                <p className={cn("text-xs text-slate-400")}>{item.label}</p>
                <p className={cn("mt-1 text-2xl font-semibold text-slate-100")}>{value}</p>
              </div>
              <Icon className={cn("size-5", item.color)} />
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
