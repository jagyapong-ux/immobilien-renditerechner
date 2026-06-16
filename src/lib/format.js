export const fmtEur = (n, digits = 0) => {
  if (n == null || isNaN(n)) return "–";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

export const fmtPct = (n, digits = 2) => {
  if (n == null || isNaN(n)) return "–";
  return `${n.toFixed(digits).replace(".", ",")} %`;
};

export const toNum = (v) => {
  if (v === "" || v == null) return null;
  const s = String(v).trim();
  let normalized;
  if (s.includes(",") && s.includes(".")) {
    // German thousands+decimal: "1.234,56" → "1234.56"
    normalized = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    // German decimal only: "3,57" → "3.57"
    normalized = s.replace(",", ".");
  } else {
    // English or plain integer: "3.57" or "10000"
    normalized = s;
  }
  const r = parseFloat(normalized);
  return isNaN(r) ? null : r;
};
