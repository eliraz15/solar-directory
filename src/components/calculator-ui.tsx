import type { ReactNode } from "react";

export function CalculatorCard({
  eyebrow,
  title,
  intro,
  children,
  footnote,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footnote: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-card">
      <div className="h-1 bg-gradient-to-l from-gold-500 to-navy-700" />
      <div className="p-6 sm:p-8">
        <p className="eyebrow text-gold-700">{eyebrow}</p>
        <h3 className="display mt-4 text-[1.5rem] leading-tight text-heading sm:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-2 text-[0.9375rem] text-muted">{intro}</p>
        {children}
        <p className="mt-6 text-xs leading-relaxed text-muted">{footnote}</p>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
      {label}
      {children}
    </label>
  );
}

export const fieldInputClass =
  "unit w-full rounded-[6px] border border-line bg-background px-3 py-2.5 text-[0.9375rem] text-foreground transition-colors hover:border-silver-500 focus:border-navy-500 focus:outline-none";

/** Dark strip of tabular readouts — the instrument panel of the calculator. */
export function ReadoutStrip({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 grid gap-px overflow-hidden rounded-[6px] bg-silver-300 sm:grid-cols-3">
      {children}
    </div>
  );
}

export function Readout({
  value,
  label,
  emphasis = false,
}: {
  value: ReactNode;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-navy-900 px-4 py-5 text-center">
      <div
        className={`unit text-[1.6rem] font-semibold leading-none ${
          emphasis ? "text-gold-500" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-2 text-xs text-white/60">{label}</div>
    </div>
  );
}
