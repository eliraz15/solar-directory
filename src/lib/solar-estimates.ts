// Illustrative assumptions for the self-service calculators - not specific
// to any address or tariff plan. Shown to users alongside every result so
// the numbers read as an estimate, not a quote.

export const ILLUSTRATIVE_TARIFF_ILS_PER_KWH = 0.62;
export const ILLUSTRATIVE_MONTHLY_KWH_PER_KW = 140;

export const CITY_PRODUCTION_MULTIPLIERS: Record<string, number> = {
  ממוצע_ארצי: 1.0,
  תל_אביב: 1.0,
  ירושלים: 0.98,
  חיפה: 0.93,
  באר_שבע: 1.05,
  אילת: 1.1,
};

export const CITY_LABELS: Record<string, string> = {
  ממוצע_ארצי: "ממוצע ארצי",
  תל_אביב: "תל אביב",
  ירושלים: "ירושלים",
  חיפה: "חיפה",
  באר_שבע: "באר שבע",
  אילת: "אילת",
};
