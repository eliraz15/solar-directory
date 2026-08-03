"use client";

import { useEffect, useRef, useState } from "react";

const STEP_MS = 16;

export function AnimatedNumber({
  value,
  duration = 700,
  formatter = (n) => Math.round(n).toLocaleString("he-IL"),
}: {
  value: number;
  duration?: number;
  formatter?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const start = Date.now();

    // setInterval (not requestAnimationFrame) so the count-up still
    // completes even in a backgrounded/non-compositing tab, where rAF
    // callbacks are suspended indefinitely.
    const interval = setInterval(() => {
      const progress = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(from + (to - from) * eased);
      if (progress >= 1) {
        fromRef.current = to;
        clearInterval(interval);
      }
    }, STEP_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{formatter(display)}</span>;
}
