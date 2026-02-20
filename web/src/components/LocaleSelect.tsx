import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type LocaleOption = {
  id: string;
  name: string;
};

type LocaleSelectProps = {
  label: string;
  options: LocaleOption[];
  value: string;
  onChange: (locale: string) => void;
  wrapperClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
  id?: string;
};

export default function LocaleSelect({
  label,
  options,
  value,
  onChange,
  wrapperClassName,
  triggerClassName,
  contentClassName,
  showIcon = true,
  id,
}: LocaleSelectProps) {
  return (
    <div
      className={cn("flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-2", wrapperClassName)}
    >
      {showIcon ? <Languages className={cn("size-4 text-slate-300")} /> : null}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={cn(
            "h-9 min-w-24 border-none bg-transparent text-slate-100 shadow-none focus-visible:ring-0",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className={cn("border-slate-700 bg-slate-900 text-slate-100", contentClassName)}>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
