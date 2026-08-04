"use client";

import { useMemo, useState } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import {
  CalculatorCard,
  Field,
  Readout,
  ReadoutStrip,
  fieldInputClass,
} from "@/components/calculator-ui";
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
    const monthlyProductionKwh =
      systemKw * ILLUSTRATIVE_MONTHLY_KWH_PER_KW * cityMultiplier;
    const currentLossPercent = Math.min(
      MAX_LOSS_PERCENT,
      months * LOSS_PERCENT_PER_MONTH,
    );
    const averageLossPercent = currentLossPercent / 2;

    const monthlyLossIlsNow =
      monthlyProductionKwh *
      (currentLossPercent / 100) *
      ILLUSTRATIVE_TARIFF_ILS_PER_KWH;
    const totalLossIls =
      monthlyProductionKwh *
      months *
      (averageLossPercent / 100) *
      ILLUSTRATIVE_TARIFF_ILS_PER_KWH;

    return { currentLossPercent, monthlyLossIlsNow, totalLossIls };
  }, [systemKw, city, months]);

  return (
    <CalculatorCard
      eyebrow="הפסד מלכלוך"
      title="כמה כסף אתם מפסידים בגלל לכלוך?"
      intro="שלושה נתונים, והערכה מיידית."
      footnote="* הערכה בלבד המבוססת על ייצור ותעריף ממוצעים. ההפסד בפועל תלוי במיקום המדויק, בזווית הגג ובתנאי מזג האוויר."
    >
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Field label="גודל מערכת (kWp)">
          <input
            type="number"
            min={1}
            max={100}
            value={systemKw}
            onChange={(e) => setSystemKw(Number(e.target.value) || 0)}
            className={fieldInputClass}
          />
        </Field>

        <Field label="עיר">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={fieldInputClass}
          >
            {Object.keys(CITY_LABELS).map((key) => (
              <option key={key} value={key}>
                {CITY_LABELS[key]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="חודשים ללא ניקוי">
          <input
            type="number"
            min={0}
            max={24}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 0)}
            className={fieldInputClass}
          />
        </Field>
      </div>

      <ReadoutStrip>
        <Readout
          value={
            <AnimatedNumber
              value={result.currentLossPercent}
              formatter={(n) => `${Math.round(n)}%`}
            />
          }
          label="ירידה משוערת בייצור כרגע"
        />
        <Readout
          emphasis
          value={
            <AnimatedNumber
              value={result.monthlyLossIlsNow}
              formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`}
            />
          }
          label="הפסד חודשי משוער"
        />
        <Readout
          emphasis
          value={
            <AnimatedNumber
              value={result.totalLossIls}
              formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`}
            />
          }
          label="הפסד מצטבר לתקופה"
        />
      </ReadoutStrip>
    </CalculatorCard>
  );
}
