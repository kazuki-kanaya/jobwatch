import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DashboardSelectOption } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type DashboardFiltersSectionProps = {
  workspaceLabel: string;
  hostLabel: string;
  queryLabel: string;
  workspaceOptions: DashboardSelectOption[];
  hostOptions: DashboardSelectOption[];
  workspaceId: string;
  hostId: string;
  query: string;
  title: string;
  applyLabel: string;
  onWorkspaceChange: (workspaceId: string) => void;
  onHostChange: (hostId: string) => void;
  onQueryChange: (query: string) => void;
  onApply: () => void;
};

export default function DashboardFiltersSection({
  workspaceLabel,
  hostLabel,
  queryLabel,
  workspaceOptions,
  hostOptions,
  workspaceId,
  hostId,
  query,
  title,
  applyLabel,
  onWorkspaceChange,
  onHostChange,
  onQueryChange,
  onApply,
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
        <div className={cn("space-y-1")}>
          <span className={cn("text-xs text-slate-400")}>{workspaceLabel}</span>
          <Select value={workspaceId} onValueChange={onWorkspaceChange}>
            <SelectTrigger
              id="dashboard-filter-workspace"
              className={cn("border-slate-600 bg-slate-800 text-slate-200")}
            >
              <SelectValue placeholder={workspaceLabel} />
            </SelectTrigger>
            <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
              {workspaceOptions.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={cn("space-y-1")}>
          <span className={cn("text-xs text-slate-400")}>{hostLabel}</span>
          <Select value={hostId} onValueChange={onHostChange}>
            <SelectTrigger id="dashboard-filter-host" className={cn("border-slate-600 bg-slate-800 text-slate-200")}>
              <SelectValue placeholder={hostLabel} />
            </SelectTrigger>
            <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
              {hostOptions.map((host) => (
                <SelectItem key={host.id} value={host.id}>
                  {host.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label htmlFor="dashboard-filter-query" className={cn("space-y-1")}>
          <span className={cn("text-xs text-slate-400")}>{queryLabel}</span>
          <Input
            id="dashboard-filter-query"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className={cn("border-slate-600 bg-slate-800 text-slate-200")}
          />
        </label>
        <div className={cn("flex items-end")}>
          <Button
            type="button"
            variant="outline"
            onClick={onApply}
            className={cn("w-full border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            {applyLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
