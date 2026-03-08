import { cn } from "@/lib/utils";

type HeaderBrandProps = {
  missionControlLabel: string;
  title: string;
  updatedAtLabel: string;
  updatedAtValue: string;
};

export function HeaderBrand({ missionControlLabel, title, updatedAtLabel, updatedAtValue }: HeaderBrandProps) {
  return (
    <div className={cn("space-y-1")}>
      <p className={cn("text-xs font-semibold tracking-[0.12em] text-cyan-300 uppercase")}>{missionControlLabel}</p>
      <div className={cn("flex items-center gap-3")}>
        <img src="/logo.png" alt="Obsern logo" className={cn("size-10 object-contain -translate-y-px")} />
        <h1 className={cn("text-3xl font-semibold text-slate-100 md:text-4xl")}>{title}</h1>
      </div>
      <p className={cn("text-sm text-slate-400")}>
        {updatedAtLabel}: {updatedAtValue}
      </p>
    </div>
  );
}
