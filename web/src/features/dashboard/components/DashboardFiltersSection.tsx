// Responsibility: Render non-interactive filter controls for dashboard layout skeleton.
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardFiltersSectionProps = {
  workspace: string;
  host: string;
  query: string;
  title: string;
  applyLabel: string;
};

export default function DashboardFiltersSection({
  workspace,
  host,
  query,
  title,
  applyLabel,
}: DashboardFiltersSectionProps) {
  return (
    <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4")}>
      <CardHeader className={cn("px-4")}>
        <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold text-slate-200")}>
          <Filter className={cn("size-4 text-cyan-300")} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("grid gap-3 px-4 md:grid-cols-[1fr_1fr_2fr_auto]")}>
        <Input value={workspace} readOnly className={cn("border-slate-600 bg-slate-800 text-slate-200")} />
        <Input value={host} readOnly className={cn("border-slate-600 bg-slate-800 text-slate-200")} />
        <Input value={query} readOnly className={cn("border-slate-600 bg-slate-800 text-slate-200")} />
        <Button variant="outline" className={cn("border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}>
          {applyLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
