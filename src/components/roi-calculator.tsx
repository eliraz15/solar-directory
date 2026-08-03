"use client";

import { useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { ILLUSTRATIVE_TARIFF_ILS_PER_KWH } from "@/lib/solar-estimates";

export function RoiCalculator() {
  const [systemCost, setSystemCost] = useState(45000);
  const [systemKw, setSystemKw] = useState(5);
  const [monthlyProductionKwh, setMonthlyProductionKwh] = useState(650);

  const result = useMemo(() => {
    const annualSavings = monthlyProductionKwh * 12 * ILLUSTRATIVE_TARIFF_ILS_PER_KWH;
    const paybackYears = annualSavings > 0 ? systemCost / annualSavings : 0;
    const profit25Years = annualSavings * 25 - systemCost;

    return { annualSavings, paybackYears, profit25Years };
  }, [systemCost, monthlyProductionKwh]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h3 className="mb-1 text-xl font-extrabold font-heading text-brand">
        מחשבון החזר השקעה
      </h3>
      <p className="mb-6 text-sm text-muted">כמה זמן ייקח למערכת שלכם להחזיר את עצמה</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          כמה עלתה המערכת? (₪)
          <input
            type="number"
            min={0}
            step={1000}
            value={systemCost}
            onChange={(e) => setSystemCost(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-[14px] border border-border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          כמה קילוואט?
          <input
            type="number"
            min={1}
            max={100}
            value={systemKw}
            onChange={(e) => setSystemKw(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-[14px] border border-border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          כמה אתם מייצרים בחודש? (קוט&quot;ש)
          <input
            type="number"
            min={0}
            step={10}
            value={monthlyProductionKwh}
            onChange={(e) => setMonthlyProductionKwh(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-[14px] border border-border px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 text-center">
          <div className="text-2xl font-extrabold font-heading text-brand">
            <AnimatedNumber value={result.paybackYears} formatter={(n) => `${n.toFixed(1)} שנים`} />
          </div>
          <div className="mt-1 text-xs text-muted">זמן החזר משוער</div>
        </div>
        <div className="rounded-xl bg-surface p-4 text-center">
          <div className="text-2xl font-extrabold font-heading text-sun-dark">
            <AnimatedNumber value={result.annualSavings} formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`} />
          </div>
          <div className="mt-1 text-xs text-muted">רווח שנתי משוער</div>
        </div>
        <div className="rounded-xl bg-surface p-4 text-center">
          <div className="text-2xl font-extrabold font-heading text-sun-dark">
            <AnimatedNumber value={result.profit25Years} formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`} />
          </div>
          <div className="mt-1 text-xs text-muted">רווח מוערך ל-25 שנה</div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">
        * הערכה בלבד לפי תעריף חשמל ממוצע קבוע - אינה מהווה ייעוץ פיננסי אישי. תעריפי חשמל
        משתנים עם הזמן, וההחזר בפועל עשוי להיות שונה.
      </p>
    </div>
  );
}
