import { GRUNDERWERB } from "../constants/grunderwerb";
import { toNum } from "./format";

export const getAfaSatz = (baujahr) => {
  const year = toNum(baujahr);
  if (!year) return 2;
  if (year >= 2023) return 3;
  if (year < 1925) return 2.5;
  return 2;
};

export const calculate = (data, skipped = {}, scenario = { mieteAdj: 0, zinsAdj: 0 }) => {
  const kp = toNum(data.kaufpreis);
  if (!kp) return null;

  const grEst = GRUNDERWERB[data.bundesland] || 5.0;
  const wfl = toNum(data.wohnflaeche);
  const notar = toNum(data.notar) ?? 2;
  const makler = skipped.makler ? 0 : (toNum(data.makler) ?? 0);
  const reno = skipped.renovierung ? 0 : (toNum(data.renovierung) ?? 0);
  const kmBase = skipped.kaltmiete ? null : toNum(data.kaltmiete);
  const km = kmBase != null ? kmBase * (1 + (scenario.mieteAdj ?? 0) / 100) : null;
  const verw = skipped.verwaltung ? 0 : (toNum(data.verwaltung) ?? 0);
  const inst = skipped.instandhaltung ? 0 : (toNum(data.instandhaltung) ?? (wfl ? wfl * 1.5 : 0));
  const ek = skipped.eigenkapital ? null : toNum(data.eigenkapital);
  const zins = (skipped.zinssatz ? 0 : (toNum(data.zinssatz) ?? 0)) + (scenario.zinsAdj ?? 0);
  const tilg = skipped.tilgung ? 0 : (toNum(data.tilgung) ?? 0);

  const grEstBetrag = kp * (grEst / 100);
  const notarBetrag = kp * (notar / 100);
  const maklerBetrag = kp * (makler / 100);
  const kaufnk = notarBetrag + maklerBetrag;
  const gesamtinvest = kp + kaufnk + reno + grEstBetrag;
  const jahresmiete = km ? km * 12 : null;
  const brutto = jahresmiete ? (jahresmiete / kp) * 100 : null;
  const jahreskosten = (verw + inst) * 12;
  const netto = jahresmiete ? ((jahresmiete - jahreskosten) / gesamtinvest) * 100 : null;
  const faktor = jahresmiete ? kp / jahresmiete : null;

  let monatsrate = null;
  let cashflow = null;
  let ekRendite = null;
  let darlehen = null;
  let zinsJahr = null;

  if (ek != null && zins > 0) {
    darlehen = Math.max(0, gesamtinvest - ek);
    monatsrate = darlehen > 0 ? (darlehen * (zins + tilg)) / 100 / 12 : 0;
    zinsJahr = darlehen * (zins / 100);
    cashflow = km != null ? km - verw - inst - monatsrate : null;
    ekRendite = cashflow != null && ek > 0 ? (cashflow * 12 / ek) * 100 : null;
  }

  let afaSatz = null;
  let afaJahr = null;
  let steuerersparnis = null;
  let cashflowNachSteuer = null;
  let ekRenditeNachSteuer = null;

  if (!skipped.steuersatz && !skipped.gebaeudeAnteil) {
    const gebaeudeAnteil = toNum(data.gebaeudeAnteil) ?? 80;
    const steuersatz = toNum(data.steuersatz) ?? 42;
    afaSatz = skipped.baujahr ? 2 : getAfaSatz(data.baujahr);
    const gebaeudeWert = kp * (gebaeudeAnteil / 100);
    afaJahr = gebaeudeWert * (afaSatz / 100);

    const werbungskosten = jahreskosten + (zinsJahr ?? 0);
    const steuerlichesErgebnis = jahresmiete != null ? jahresmiete - werbungskosten - afaJahr : null;

    if (steuerlichesErgebnis != null && steuerlichesErgebnis < 0) {
      steuerersparnis = Math.abs(steuerlichesErgebnis) * (steuersatz / 100);
      if (cashflow != null) {
        cashflowNachSteuer = cashflow + steuerersparnis / 12;
        ekRenditeNachSteuer = ek > 0 ? (cashflowNachSteuer * 12 / ek) * 100 : null;
      }
    } else if (steuerlichesErgebnis != null && steuerlichesErgebnis >= 0 && cashflow != null) {
      const steuerlast = steuerlichesErgebnis * (steuersatz / 100);
      cashflowNachSteuer = cashflow - steuerlast / 12;
      ekRenditeNachSteuer = ek > 0 ? (cashflowNachSteuer * 12 / ek) * 100 : null;
    } else if (cashflow != null) {
      cashflowNachSteuer = cashflow;
    }
  }

  return {
    kp,
    wfl,
    grEst,
    grEstBetrag,
    notarBetrag,
    maklerBetrag,
    kaufnk,
    reno,
    gesamtinvest,
    jahresmiete,
    brutto,
    netto,
    faktor,
    verw,
    inst,
    km,
    monatsrate,
    cashflow,
    ekRendite,
    darlehen,
    zinsJahr,
    afaSatz,
    afaJahr,
    steuerersparnis,
    cashflowNachSteuer,
    ekRenditeNachSteuer,
    zins,
    tilg,
  };
};
