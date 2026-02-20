import { compareRows } from "@/features/landing/constants";
import type { LandingTexts } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LandingComparisonSectionProps = {
  texts: LandingTexts;
};

export default function LandingComparisonSection({ texts }: LandingComparisonSectionProps) {
  return (
    <section id="comparison" className={cn("bg-[#070d18] py-16 md:py-20")}>
      <div className={cn("mx-auto w-full max-w-4xl px-4 md:px-8")}>
        <h2 className={cn("text-center text-3xl font-bold text-white md:text-4xl")}>{texts.landing_compare_title}</h2>
        <p className={cn("mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-slate-300 md:text-base")}>
          {texts.landing_compare_subtitle}
        </p>
        <div className={cn("mt-10 overflow-x-auto rounded-xl border border-[#243246] bg-[#0d1625]")}>
          <table className={cn("w-full min-w-[680px] border-collapse text-left text-sm")}>
            <thead>
              <tr className={cn("border-b border-[#233041] text-slate-500 uppercase")}>
                <th className={cn("px-4 py-3 text-[11px]")}>{texts.landing_compare_col_feature}</th>
                <th className={cn("bg-cyan-400/10 px-4 py-3 text-[11px] text-white")}>Jobwatch</th>
                <th className={cn("px-4 py-3 text-[11px]")}>MLflow</th>
                <th className={cn("px-4 py-3 text-[11px]")}>TensorBoard</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.key} className={cn("border-b border-[#1f2b3b] last:border-b-0")}>
                  <td className={cn("px-4 py-4 text-slate-300")}>{texts[`landing_compare_${row.key}_label`]}</td>
                  <td className={cn("bg-cyan-400/10 px-4 py-4 font-semibold text-cyan-200")}>{texts[row.jobwatch]}</td>
                  <td className={cn("px-4 py-4 text-slate-400")}>{texts[row.mlflow]}</td>
                  <td className={cn("px-4 py-4 text-slate-400")}>{texts[row.tensor]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
