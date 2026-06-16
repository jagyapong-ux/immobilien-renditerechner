export const extractFromText = (text) => {
  const out = {};

  let m = text.match(
    /(?:Kaufpreis|Angebotspreis|Verkaufspreis)[^\d]{0,15}([\d.]+(?:,\d+)?)\s*(?:€|EUR)/i
  );
  if (!m) m = text.match(/([\d]{2,3}(?:\.\d{3})+(?:,\d+)?)\s*(?:€|EUR)/);
  if (m) {
    const v = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (v > 10_000) out.kaufpreis = String(Math.round(v));
  }

  m = text.match(
    /(?:Kaltmiete|Nettokaltmiete|Nettomiete)[^\d]{0,10}([\d.,]+)\s*(?:€|EUR)/i
  );
  if (m) {
    const v = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (v > 50 && v < 50_000) out.kaltmiete = String(Math.round(v));
  }

  m = text.match(/(?:Wohnfläche|Wfl\.|Nutzfläche)[^\d]{0,10}([\d.,]+)\s*m/i);
  if (!m) m = text.match(/([\d]{2,3}(?:,\d+)?)\s*m[²2]/);
  if (m) {
    const v = parseFloat(m[1].replace(",", "."));
    if (v > 10 && v < 2_000) out.wohnflaeche = String(Math.round(v));
  }

  m = text.match(/(?:Baujahr|Bj\.?)\D{0,5}((?:19|20)\d{2})/i);
  if (!m) m = text.match(/\b(1(?:9\d{2})|20[012]\d)\b/);
  if (m) out.baujahr = m[1];

  return out;
};
