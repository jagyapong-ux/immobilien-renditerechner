import Field from "./Field";
import { GRUNDERWERB, MAKLER_HINWEIS, STEPS } from "../constants/grunderwerb";
import { getAfaSatz } from "../lib/calculations";
import { fmtEur, fmtPct, toNum } from "../lib/format";

const WIZARD_STEPS = 5;

export default function Wizard({ step, setStep, d, set, skipped, skip, calc }) {
  const grEst = GRUNDERWERB[d.bundesland] || 5.0;
  const grEstBetrag = calc?.grEstBetrag ?? (toNum(d.kaufpreis) ? toNum(d.kaufpreis) * grEst / 100 : null);
  const afaSatz = getAfaSatz(d.baujahr);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep((s) => s - 1)}
            className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-500 text-sm"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">{STEPS[step]}</span>
              <span>Schritt {step} / {WIZARD_STEPS}</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(step / WIZARD_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          {step === 1 && (
            <>
              <h2 className="font-bold text-slate-800 text-lg">🏠 Objekt &amp; Kaufpreis</h2>
              <Field label="Kaufpreis" required value={d.kaufpreis} onChange={(v) => set("kaufpreis", v)} suffix="€" placeholder="z.B. 250000" help="Angebotspreis laut Exposé" />
              <Field label="Wohnfläche" value={d.wohnflaeche} onChange={(v) => set("wohnflaeche", v)} suffix="m²" placeholder="z.B. 75" onSkip={(v) => skip("wohnflaeche", v)} isSkipped={skipped.wohnflaeche} />
              <Field label="Baujahr" value={d.baujahr} onChange={(v) => set("baujahr", v)} placeholder="z.B. 1990" onSkip={(v) => skip("baujahr", v)} isSkipped={skipped.baujahr} />
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Bundesland</label>
                <select
                  value={d.bundesland}
                  onChange={(e) => set("bundesland", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {Object.keys(GRUNDERWERB).sort().map((bl) => <option key={bl}>{bl}</option>)}
                </select>
                <p className="text-xs text-slate-400">
                  Grunderwerbsteuer: <strong>{grEst} %</strong>
                  {grEstBetrag ? ` = ${fmtEur(grEstBetrag)}` : ""}
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-bold text-slate-800 text-lg">💰 Kaufnebenkosten</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                <strong>Grunderwerbsteuer {d.bundesland}:</strong> {grEst} %
                {grEstBetrag ? ` = ${fmtEur(grEstBetrag)}` : ""}
              </div>
              <Field label="Notarkosten" value={d.notar} onChange={(v) => set("notar", v)} suffix="%" placeholder="2" help="Üblich: 1,5–2 %" />
              <Field label="Maklerprovision" value={d.makler} onChange={(v) => set("makler", v)} suffix="%" placeholder="3.57" help={MAKLER_HINWEIS[d.bundesland] ?? "Käuferseite: 0–3,57 %"} onSkip={(v) => skip("makler", v)} isSkipped={skipped.makler} />
              <Field label="Renovierungskosten (einmalig)" value={d.renovierung} onChange={(v) => set("renovierung", v)} suffix="€" placeholder="z.B. 10000" onSkip={(v) => skip("renovierung", v)} isSkipped={skipped.renovierung} />
              <Field label="Eigenkapital" value={d.eigenkapital} onChange={(v) => set("eigenkapital", v)} suffix="€" placeholder={calc ? `z.B. ${fmtEur(calc.gesamtinvest * 0.2, 0)}` : "z.B. 60000"} onSkip={(v) => skip("eigenkapital", v)} isSkipped={skipped.eigenkapital} />
              <Field label="Zinssatz p.a." value={d.zinssatz} onChange={(v) => set("zinssatz", v)} suffix="%" onSkip={(v) => skip("zinssatz", v)} isSkipped={skipped.zinssatz} />
              {calc && (
                <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Kaufnebenkosten gesamt</span>
                    <strong>{fmtEur(calc.kaufnk)}</strong>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800 pt-1 border-t border-slate-200">
                    <span>Gesamtinvestition</span>
                    <span>{fmtEur(calc.gesamtinvest)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-bold text-slate-800 text-lg">📈 Mieteinnahmen &amp; lfd. Kosten</h2>
              <Field label="Kaltmiete (monatlich)" value={d.kaltmiete} onChange={(v) => set("kaltmiete", v)} suffix="€" placeholder="z.B. 850" onSkip={(v) => skip("kaltmiete", v)} isSkipped={skipped.kaltmiete} />
              <Field label="Hausverwaltung (monatlich)" value={d.verwaltung} onChange={(v) => set("verwaltung", v)} suffix="€" placeholder="z.B. 30–60" onSkip={(v) => skip("verwaltung", v)} isSkipped={skipped.verwaltung} />
              <Field
                label="Instandhaltungsrücklage (monatlich)"
                value={d.instandhaltung}
                onChange={(v) => set("instandhaltung", v)}
                suffix="€"
                placeholder={toNum(d.wohnflaeche) ? `ca. ${fmtEur(toNum(d.wohnflaeche) * 1.5, 0)}/Monat` : "z.B. 75"}
                help={`Faustregel: ~1,50 €/m²`}
                onSkip={(v) => skip("instandhaltung", v)}
                isSkipped={skipped.instandhaltung}
              />
              {calc?.netto != null && (
                <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nettomietrendite</span>
                    <span className="font-bold text-blue-700">{fmtPct(calc.netto)}</span>
                  </div>
                  {calc.cashflow != null && (
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Cashflow</span>
                      <span className={`font-semibold ${calc.cashflow >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {calc.cashflow >= 0 ? "+" : ""}{fmtEur(calc.cashflow)}/Monat
                      </span>
                    </div>
                  )}
                  {calc.ekRendite != null && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eigenkapitalrendite</span>
                      <span className={`font-semibold ${calc.ekRendite >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {fmtPct(calc.ekRendite)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-bold text-slate-800 text-lg">🏦 Finanzierung <span className="text-sm font-normal text-slate-400">(optional)</span></h2>
              <Field label="Anfangstilgung p.a." value={d.tilgung} onChange={(v) => set("tilgung", v)} suffix="%" onSkip={(v) => skip("tilgung", v)} isSkipped={skipped.tilgung} />
              {calc?.monatsrate != null && (
                <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monatsrate</span>
                    <strong>{fmtEur(calc.monatsrate)}</strong>
                  </div>
                  {calc.cashflow != null && (
                    <div className="flex justify-between font-semibold pt-1 border-t border-slate-200">
                      <span>Cashflow</span>
                      <span className={calc.cashflow >= 0 ? "text-green-600" : "text-red-600"}>
                        {calc.cashflow >= 0 ? "+" : ""}{fmtEur(calc.cashflow)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="font-bold text-slate-800 text-lg">🧾 Steuer &amp; AfA <span className="text-sm font-normal text-slate-400">(optional)</span></h2>
              <p className="text-xs text-slate-500">Vereinfachte Berechnung für vermietete Wohnimmobilien</p>
              <Field
                label="Gebäudeanteil am Kaufpreis"
                value={d.gebaeudeAnteil}
                onChange={(v) => set("gebaeudeAnteil", v)}
                suffix="%"
                placeholder="80"
                help="Typisch 75–85 % (Rest = Grundstück, nicht abschreibbar)"
                onSkip={(v) => skip("gebaeudeAnteil", v)}
                isSkipped={skipped.gebaeudeAnteil}
              />
              <Field
                label="Persönlicher Grenzsteuersatz"
                value={d.steuersatz}
                onChange={(v) => set("steuersatz", v)}
                suffix="%"
                placeholder="42"
                help="z.B. 42 % (Spitzensteuersatz) oder 35 %"
                onSkip={(v) => skip("steuersatz", v)}
                isSkipped={skipped.steuersatz}
              />
              {!skipped.baujahr && d.baujahr && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  AfA-Satz (Bj. {d.baujahr}): <strong>{afaSatz} %</strong> p.a.
                  {calc?.afaJahr != null && ` → ${fmtEur(calc.afaJahr)}/Jahr`}
                </div>
              )}
              {calc?.steuerersparnis != null && calc.steuerersparnis > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
                  Geschätzte Steuerersparnis: <strong>{fmtEur(calc.steuerersparnis)}/Jahr</strong>
                  {calc.cashflowNachSteuer != null && (
                    <span className="block mt-1">Cashflow nach Steuer: {fmtEur(calc.cashflowNachSteuer)}/Monat</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setStep((s) => (s < WIZARD_STEPS ? s + 1 : 6))}
          disabled={step === 1 && !d.kaufpreis}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition"
        >
          {step < WIZARD_STEPS ? "Weiter →" : "📊 Ergebnis anzeigen"}
        </button>

        {step >= 2 && (
          <button onClick={() => setStep(6)} className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-1">
            Direkt zum Ergebnis überspringen
          </button>
        )}
      </div>
    </div>
  );
}
