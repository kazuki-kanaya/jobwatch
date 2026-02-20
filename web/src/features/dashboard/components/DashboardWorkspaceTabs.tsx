import { cn } from "@/lib/utils";

export type DashboardWorkspaceTab = "overview" | "members";

type DashboardWorkspaceTabsProps = {
  value: DashboardWorkspaceTab;
  overviewLabel: string;
  membersLabel: string;
  onChange: (value: DashboardWorkspaceTab) => void;
};

export default function DashboardWorkspaceTabs({
  value,
  overviewLabel,
  membersLabel,
  onChange,
}: DashboardWorkspaceTabsProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-slate-700/70 bg-slate-900/70 p-1")}>
      <button
        type="button"
        onClick={() => onChange("overview")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-semibold transition",
          value === "overview" ? "bg-cyan-500/20 text-cyan-200" : "text-slate-300 hover:text-slate-100",
        )}
      >
        {overviewLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("members")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-semibold transition",
          value === "members" ? "bg-cyan-500/20 text-cyan-200" : "text-slate-300 hover:text-slate-100",
        )}
      >
        {membersLabel}
      </button>
    </div>
  );
}
