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
      <DialogContent className={cn("border-amber-300/40 bg-[#1a1302] text-amber-50")}>
        <DialogHeader>
          <DialogTitle className={cn("text-amber-100")}>{title}</DialogTitle>
          <DialogDescription className={cn("text-amber-100/75")}>{description}</DialogDescription>
        </DialogHeader>
        {tokenMessage ? <p className={cn("text-xs text-amber-100/90")}>{tokenMessage}</p> : null}
        <div
          className={cn(
            "rounded-lg border border-amber-300/35 bg-black/20 px-3 py-2 font-mono text-xs break-all text-amber-50",
          )}
        >
          <span className={cn("font-semibold text-amber-200")}>{tokenLabel}:</span> {token ?? "-"}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={cn("cursor-pointer border-amber-300/35 bg-transparent text-amber-100 hover:bg-amber-200/10")}
          >
            <X className={cn("size-4")} />
            {closeLabel}
          </Button>
          <Button
            type="button"
            onClick={onCopy}
            disabled={!token}
            className={cn(
              "cursor-pointer bg-amber-400 text-[#2a1b00] hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50",
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
