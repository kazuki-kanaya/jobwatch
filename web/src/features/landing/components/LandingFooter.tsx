import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingFooterProps = {
  texts: LandingTexts;
};

export default function LandingFooter({ texts }: LandingFooterProps) {
  return (
    <footer className={cn("border-t border-[#1f2c3a] bg-[#0b111d] py-12")}>
      <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-8")}>
        <div
          className={cn(
            "flex flex-col items-start justify-between gap-5 rounded-2xl border border-cyan-400/20 bg-[#10192b] p-6 md:flex-row md:items-center",
          )}
        >
          <div className={cn("space-y-2")}>
            <p className={cn("text-lg font-semibold text-white md:text-xl")}>{texts.landing_footer_star_title}</p>
            <p className={cn("text-sm leading-7 text-slate-300 md:text-base")}>{texts.landing_footer_star_subtitle}</p>
          </div>
          <a
            href="https://github.com/kazuki-kanaya/jobwatch"
            target="_blank"
            rel="noreferrer"
            className={cn("md:shrink-0")}
          >
            <Button className={cn("h-11 bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300")}>
              <Github className={cn("mr-2 size-4")} />
              {texts.landing_footer_star_cta}
            </Button>
          </a>
        </div>
      </div>
    </footer>
  );
}
