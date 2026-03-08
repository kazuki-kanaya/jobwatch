import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WorkspaceCreateButtonProps = {
  addLabel: string;
  noPermissionLabel: string;
  canCreate: boolean;
  onCreateWorkspace: () => void;
};

export function WorkspaceCreateButton({
  addLabel,
  noPermissionLabel,
  canCreate,
  onCreateWorkspace,
}: WorkspaceCreateButtonProps) {
  return (
    <div className={cn("flex flex-wrap gap-2")}>
      <Button
        type="button"
        size="sm"
        onClick={onCreateWorkspace}
        disabled={!canCreate}
        title={!canCreate ? noPermissionLabel : undefined}
        className={cn(
          "h-11 cursor-pointer rounded-xl border border-cyan-400/35 bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed",
        )}
      >
        <Plus className={cn("size-4")} />
        {addLabel}
      </Button>
    </div>
  );
}
