import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type HostTokenDialogProps = {
  title: string;
  description: string;
  tokenLabel: string;
  copyLabel: string;
  closeLabel: string;
  token: string | null;
  tokenMessage: string | null;
  isOpen: boolean;
  onCopy: () => void;
  onClose: () => void;
};

export function HostTokenDialog({
  title,
  description,
  tokenLabel,
  copyLabel,
  closeLabel,
  token,
  tokenMessage,
  isOpen,
  onCopy,
  onClose,
}: HostTokenDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("border-slate-700 bg-slate-900 text-slate-100")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={cn("text-slate-400")}>{description}</DialogDescription>
        </DialogHeader>
        {tokenMessage ? <p className={cn("text-xs text-slate-300")}>{tokenMessage}</p> : null}
        <div
          className={cn(
            "rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 font-mono text-xs break-all text-slate-100",
          )}
        >
          <span className={cn("font-semibold text-cyan-300")}>{tokenLabel}:</span> {token ?? "-"}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={cn("cursor-pointer border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700")}
          >
            <X className={cn("size-4")} />
            {closeLabel}
          </Button>
          <Button
            type="button"
            onClick={onCopy}
            disabled={!token}
            className={cn(
              "cursor-pointer bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <Copy className={cn("size-4")} />
            {copyLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
