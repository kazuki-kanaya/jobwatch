import { type ReactNode, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WorkspaceContentTab = "operations" | "people";

type WorkspaceContentTabsProps = {
  workspaceHeader: ReactNode;
  snapshot: ReactNode;
  operationsLabel: string;
  peopleLabel: string;
  operationsContent: ReactNode;
  peopleContent: ReactNode;
  hint?: string;
};

export function WorkspaceContentTabs({
  workspaceHeader,
  snapshot,
  operationsLabel,
  peopleLabel,
  operationsContent,
  peopleContent,
  hint,
}: WorkspaceContentTabsProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceContentTab>("operations");
  const id = useId();
  const operationsTabId = `${id}-operations-tab`;
  const peopleTabId = `${id}-people-tab`;
  const operationsPanelId = `${id}-operations-panel`;
  const peoplePanelId = `${id}-people-panel`;

  return (
    <section
      className={cn(
        "rounded-[2rem] border border-slate-800/45 bg-slate-950/15 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)] md:p-6",
      )}
    >
      <div className={cn("grid gap-4")}>
        <div className={cn("space-y-3")}>
          {hint ? <div className={cn("text-sm text-slate-300/80")}>{hint}</div> : null}
          {workspaceHeader}
        </div>

        {snapshot}

        <div
          className={cn("flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-2")}
          role="tablist"
          aria-orientation="horizontal"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("operations")}
            role="tab"
            id={operationsTabId}
            aria-selected={activeTab === "operations"}
            aria-controls={operationsPanelId}
            tabIndex={activeTab === "operations" ? 0 : -1}
            className={cn(
              "rounded-xl px-4 text-sm font-semibold",
              activeTab === "operations"
                ? "bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-50"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50",
            )}
          >
            {operationsLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("people")}
            role="tab"
            id={peopleTabId}
            aria-selected={activeTab === "people"}
            aria-controls={peoplePanelId}
            tabIndex={activeTab === "people" ? 0 : -1}
            className={cn(
              "rounded-xl px-4 text-sm font-semibold",
              activeTab === "people"
                ? "bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/20 hover:text-cyan-50"
                : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50",
            )}
          >
            {peopleLabel}
          </Button>
        </div>

        <div
          className={cn("min-w-0")}
          role="tabpanel"
          id={activeTab === "operations" ? operationsPanelId : peoplePanelId}
          aria-labelledby={activeTab === "operations" ? operationsTabId : peopleTabId}
        >
          {activeTab === "operations" ? operationsContent : peopleContent}
        </div>
      </div>
    </section>
  );
}
