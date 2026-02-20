import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardWorkspaceContextCardProps = {
  label: string;
  name: string;
  hint: string;
};

export default function DashboardWorkspaceContextCard({ label, name, hint }: DashboardWorkspaceContextCardProps) {
  return (
    <Card className={cn("border-slate-700/70 bg-slate-900/80 py-3")}>
      <CardContent className={cn("flex flex-wrap items-center justify-between gap-3 px-4")}>
        <div className={cn("space-y-1")}>
          <p className={cn("text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase")}>{label}</p>
          <p className={cn("text-xl font-semibold text-cyan-200 md:text-2xl")}>{name}</p>
          <p className={cn("text-xs text-slate-400")}>{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
