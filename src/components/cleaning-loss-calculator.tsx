"use client";

import { useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import {
  CITY_LABELS,
  CITY_PRODUCTION_MULTIPLIERS,
  ILLUSTRATIVE_MONTHLY_KWH_PER_KW,
  ILLUSTRATIVE_TARIFF_ILS_PER_KWH,
} from "@/lib/solar-estimates";

const MAX_LOSS_PERCENT = 30;
const LOSS_PERCENT_PER_MONTH = 3;

export function CleaningLossCalculator() {
  const [systemKw, setSystemKw] = useState(5);
  const [city, setCity] = useState("ממוצע_ארצי");
  const [months, setMonths] = useState(4);

  const result = useMemo(() => {
    const cityMultiplier = CITY_PRODUCTION_MULTIPLIERS[city] ?? 1;
    const monthlyProductionKwh = systemKw * ILLUSTRATIVE_MONTHLY_KWH_PER_KW * cityMultiplier;
    const currentLossPercent = Math.min(MAX_LOSS_PERCENT, months * LOSS_PERCENT_PER_MONTH);
    const averageLossPercent = currentLossPercent / 2;

    const monthlyLossIlsNow =
      monthlyProductionKwh * (currentLossPercent / 100) * ILLUSTRATIVE_TARIFF_ILS_PER_KWH;
    const totalLossIls =
      monthlyProductionKwh * months * (averageLossPercent / 100) * ILLUSTRATIVE_TARIFF_ILS_PER_KWH;

    return { currentLossPercent, monthlyLossIlsNow, totalLossIls };
  }, [systemKw, city, months]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h3 className="mb-1 text-xl font-extrabold font-heading text-brand">
        כמה כסף אתם מפסידים בגלל לכלוך?
      </h3>
      <p className="mb-6 text-sm text-muted">הזינו כמה פרטים וקבלו הערכה מיידית</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          גודל מערכת (קילוואט)
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
          עיר
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-[14px] border border-border px-3 py-2"
          >
            {Object.keys(CITY_LABELS).map((key) => (
              <option key={key} value={key}>
                {CITY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          חודשים ללא ניקוי
          <input
            type="number"
            min={0}
            max={24}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-[14px] border border-border px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 text-center">
          <div className="text-2xl font-extrabold font-heading text-brand">
            <AnimatedNumber value={result.currentLossPercent} formatter={(n) => `${Math.round(n)}%`} />
          </div>
          <div className="mt-1 text-xs text-muted">ירידה משוערת בייצור כרגע</div>
        </div>
        <div className="rounded-xl bg-surface p-4 text-center">
          <div className="text-2xl font-extrabold font-heading text-sun-dark">
            <AnimatedNumber value={result.monthlyLossIlsNow} formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`} />
          </div>
          <div className="mt-1 text-xs text-muted">הפסד חודשי משוער כרגע</div>
        </div>
        <div className="rounded-xl bg-surface p-4 text-center">
          <div className="text-2xl font-extrabold font-heading text-sun-dark">
            <AnimatedNumber value={result.totalLossIls} formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`} />
          </div>
          <div className="mt-1 text-xs text-muted">הפסד כולל מוערך לתקופה</div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">
        * הערכה בלבד המבוססת על הנחות ממוצעות (תעריף חשמל וייצור ממוצע לקילוואט) - החיסכון בפועל
        תלוי במיקום המדויק, בגודל המערכת ובתנאי מזג האוויר.
      </p>
    </div>
  );
}
