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
import { ILLUSTRATIVE_TARIFF_ILS_PER_KWH } from "@/lib/solar-estimates";

export function RoiCalculator() {
  const [systemCost, setSystemCost] = useState(45000);
  const [systemKw, setSystemKw] = useState(5);
  const [monthlyProductionKwh, setMonthlyProductionKwh] = useState(650);

  const result = useMemo(() => {
    const annualSavings =
      monthlyProductionKwh * 12 * ILLUSTRATIVE_TARIFF_ILS_PER_KWH;
    const paybackYears = annualSavings > 0 ? systemCost / annualSavings : 0;
    const profit25Years = annualSavings * 25 - systemCost;

    return { annualSavings, paybackYears, profit25Years };
  }, [systemCost, monthlyProductionKwh]);

  return (
    <CalculatorCard
      eyebrow="החזר השקעה"
      title="כמה זמן ייקח למערכת להחזיר את עצמה?"
      intro="לפי מה שהמערכת עלתה ומה שהיא מייצרת בפועל."
      footnote="* הערכה בלבד לפי תעריף חשמל ממוצע קבוע — אינה מהווה ייעוץ פיננסי. תעריפי החשמל משתנים עם הזמן, וההחזר בפועל עשוי להיות שונה."
    >
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Field label="עלות המערכת (₪)">
          <input
            type="number"
            min={0}
            step={1000}
            value={systemCost}
            onChange={(e) => setSystemCost(Number(e.target.value) || 0)}
            className={fieldInputClass}
          />
        </Field>

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

        <Field label="ייצור חודשי (kWh)">
          <input
            type="number"
            min={0}
            step={10}
            value={monthlyProductionKwh}
            onChange={(e) => setMonthlyProductionKwh(Number(e.target.value) || 0)}
            className={fieldInputClass}
          />
        </Field>
      </div>

      <ReadoutStrip>
        <Readout
          emphasis
          value={
            <AnimatedNumber
              value={result.paybackYears}
              formatter={(n) => `${n.toFixed(1)}`}
            />
          }
          label="שנים עד החזר ההשקעה"
        />
        <Readout
          value={
            <AnimatedNumber
              value={result.annualSavings}
              formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`}
            />
          }
          label="חיסכון שנתי משוער"
        />
        <Readout
          value={
            <AnimatedNumber
              value={result.profit25Years}
              formatter={(n) => `${Math.round(n).toLocaleString("he-IL")} ₪`}
            />
          }
          label="רווח מצטבר ל־25 שנה"
        />
      </ReadoutStrip>
    </CalculatorCard>
  );
}
