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
          "h-11 cursor-pointer rounded-xl bg-[linear-gradient(135deg,#5eead4_0%,#22d3ee_48%,#38bdf8_100%)] px-4 text-sm font-semibold text-[#04223a] shadow-[0_10px_20px_rgba(34,211,238,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed",
        )}
      >
        <Plus className={cn("size-4")} />
        {addLabel}
      </Button>
    </div>
  );
}
