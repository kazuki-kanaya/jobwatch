import { Github, SquareTerminal } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { LandingOption, LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingHeaderProps = {
  texts: LandingTexts;
  localeOptions: LandingOption[];
  localeValue: string;
  onLocaleChange: (locale: string) => void;
};

export default function LandingHeader({ texts, localeOptions, localeValue, onLocaleChange }: LandingHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-[#253349]/80 bg-[#0a1020]/80 backdrop-blur-md")}>
      <div className={cn("mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8")}>
        <div className={cn("flex items-center gap-2")}>
          <span className={cn("inline-flex size-7 items-center justify-center rounded-md bg-blue-500/90 text-white")}>
            <SquareTerminal className={cn("size-4")} />
          </span>
          <p className={cn("text-xl font-semibold text-slate-100")}>Jobwatch</p>
        </div>
        <nav className={cn("hidden items-center gap-8 text-base text-slate-300 md:flex")}>
          <a href="#features" className={cn("transition hover:text-cyan-300")}>
            {texts.landing_nav_features}
          </a>
          <a href="#how-it-works" className={cn("transition hover:text-cyan-300")}>
            {texts.landing_nav_how_it_works}
          </a>
          <a href="#comparison" className={cn("transition hover:text-cyan-300")}>
            {texts.landing_nav_comparison}
          </a>
          <a href="#docs" className={cn("transition hover:text-cyan-300")}>
            {texts.landing_nav_docs}
          </a>
        </nav>
        <div className={cn("flex items-center gap-2")}>
          <a
            href="https://github.com/kazuki-kanaya/jobwatch"
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md border border-[#314760] bg-[#141c32] text-slate-300 hover:text-white",
            )}
          >
            <Github className={cn("size-4")} />
          </a>
          <Link to="/dashboard">
            <Button className={cn("h-10 bg-blue-500 px-5 text-sm text-white hover:bg-blue-400")}>
              {texts.landing_get_started}
            </Button>
          </Link>
          <div
            className={cn(
              "hidden items-center rounded border border-[#2c3c4f] px-1 py-0.5 text-[11px] font-semibold lg:flex",
            )}
          >
            {localeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onLocaleChange(opt.id)}
                className={cn(
                  "rounded px-2 py-0.5",
                  localeValue === opt.id ? "bg-[#1d3d77] text-cyan-100" : "text-slate-300",
                )}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
