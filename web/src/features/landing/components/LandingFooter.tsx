import { SquareTerminal } from "lucide-react";
import type { LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingFooterProps = {
  texts: LandingTexts;
};

export default function LandingFooter({ texts }: LandingFooterProps) {
  return (
    <footer className={cn("border-t border-[#1f2c3a] bg-[#0b111d] py-12")}>
      <div className={cn("mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-4 md:px-8")}>
        <div className={cn("md:col-span-2")}>
          <div className={cn("flex items-center gap-2")}>
            <SquareTerminal className={cn("size-4 text-cyan-300")} />
            <p className={cn("font-semibold text-white")}>Jobwatch</p>
          </div>
          <p className={cn("mt-4 max-w-md text-sm text-slate-400")}>{texts.landing_footer_blurb}</p>
        </div>
        <div>
          <p className={cn("text-sm font-semibold text-white")}>{texts.landing_footer_product}</p>
          <ul className={cn("mt-3 space-y-2 text-sm text-slate-400")}>
            <li>{texts.landing_nav_features}</li>
            <li>{texts.landing_nav_comparison}</li>
            <li>{texts.landing_nav_docs}</li>
          </ul>
        </div>
        <div>
          <p className={cn("text-sm font-semibold text-white")}>{texts.landing_footer_company}</p>
          <ul className={cn("mt-3 space-y-2 text-sm text-slate-400")}>
            <li>GitHub</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
