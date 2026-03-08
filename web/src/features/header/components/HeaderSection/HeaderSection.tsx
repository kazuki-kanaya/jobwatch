import { Card, CardContent } from "@/components/ui/card";
import type { HeaderSectionProps } from "@/features/header/components/types";
import { cn } from "@/lib/utils";

export function HeaderSection({ brand, userCard, controls, profileDialog }: HeaderSectionProps) {
  return (
    <>
      <Card className={cn("border-slate-700/60 bg-slate-900/80 py-4 backdrop-blur")}>
        <CardContent className={cn("flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between")}>
          {brand}
          <div className={cn("flex w-full flex-col items-start gap-3 md:w-auto md:items-end")}>
            {userCard}
            {controls}
          </div>
        </CardContent>
      </Card>
      {profileDialog}
    </>
  );
}
