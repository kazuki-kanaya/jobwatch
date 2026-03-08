import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type InvitationManagementSectionProps = {
  title: ReactNode;
  list: ReactNode;
  dialogs?: ReactNode;
};

export function InvitationManagementSection({ title, list, dialogs }: InvitationManagementSectionProps) {
  return (
    <>
      <Card
        className={cn(
          "relative rounded-3xl border border-slate-700/70 bg-slate-900/80 py-5 shadow-[0_16px_40px_rgba(2,6,23,0.45)]",
        )}
      >
        <CardHeader className={cn("space-y-5 px-6 pb-4")}>
          <CardTitle className={cn("text-2xl font-semibold tracking-tight text-slate-100")}>{title}</CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-4 px-6")}>{list}</CardContent>
      </Card>
      {dialogs}
    </>
  );
}
