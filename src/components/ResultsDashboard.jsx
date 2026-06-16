import { useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Badge from "./Badge";
import KPI from "./KPI";
import ScenarioSliders from "./ScenarioSliders";
import { PIE_COLORS } from "../constants/grunderwerb";
import { fmtEur, fmtPct } from "../lib/format";

export default function ResultsDashboard({
  calc, d, skipped, scenario, setScenario,
  compareCalc, onBack, onReset, onEdit, onSave,
  saveMsg,
}) {
  const exportRef = useRef(null);

  const pieData = [
    { name: "Kaufpreis", value: calc.kp },
    { name: "Grunderwerbsteuer", value: Math.round(calc.grEstBetrag) },
    { name: "Notar", value: Math.round(calc.notarBetrag) },
    calc.maklerBetrag > 0 && { name: "Makler", value: Math.round(calc.maklerBetrag) },
    calc.reno > 0 && { name: "Renovierung", value: calc.reno },
  ].filter(Boolean);

  const barData = calc.km ? [
    { name: "Kaltmiete", value: calc.km, fill: "#10b981" },
    { name: "Verwaltung", value: -calc.verw, fill: "#f59e0b" },
    { name: "Instandhaltung", value: -calc.inst, fill: "#8b5cf6" },
    ...(calc.monatsrate != null ? [{ name: "Monatsrate", value: -calc.monatsrate, fill: "#ef4444" }] : []),
  ] : [];

  const handleExportPdf = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, { scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, Math.min(h, 280));
    pdf.save(`rendite-${calc.kp}.pdf`);
  };

  const cf = calc.cashflowNachSteuer ?? calc.cashflow;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700">← Zurück</button>
          <h1 className="font-extrabold text-slate-800">📊 Rendite-Analyse</h1>
          <button onClick={onReset} className="text-xs text-blue-500 hover:underline">Neu berechnen</button>
        </div>

        <div ref={exportRef} className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex justify-between items-start flex-wrap gap-3">
            <div>
              <p className="text-xs text-slate-400">Kaufpreis</p>
              <p className="text-2xl font-extrabold text-slate-900">{fmtEur(calc.kp)}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {d.bundesland}
                {calc.wfl ? ` · ${calc.wfl} m²` : ""}
                {d.baujahr && !skipped.baujahr ? ` · Bj. ${d.baujahr}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Gesamtinvestition</p>
              <p className="text-lg font-bold text-slate-700">{fmtEur(calc.gesamtinvest)}</p>
            </div>
          </div>

          <ScenarioSliders scenario={scenario} onChange={setScenario} baseZins={calc.zins - (scenario.zinsAdj ?? 0)} baseKm={calc.km != null ? calc.km / (1 + (scenario.mieteAdj ?? 0) / 100) : null} />

          <div className="grid grid-cols-2 gap-3">
            <KPI title="Bruttomietrendite" value={fmtPct(calc.brutto)} sub="Jahreskaltmiete / Kaufpreis" badge={<Badge value={calc.brutto} warn={4} good={5} />} />
            <KPI title="Kaufpreisfaktor" value={calc.faktor ? `${calc.faktor.toFixed(1).replace(".", ",")}×` : "–"} sub="Kaufpreis / Jahreskaltmiete" badge={<Badge value={calc.faktor} warn={20} good={25} higherIsBetter={false} />} />
            <KPI title="Nettomietrendite" value={fmtPct(calc.netto)} sub="nach Verwaltung & Instandh." badge={<Badge value={calc.netto} warn={3} good={4} />} />
            {calc.wfl ? (
              <KPI title="Preis / m²" value={fmtEur(calc.kp / calc.wfl, 0)} sub={`bei ${calc.wfl} m² Wohnfläche`} />
            ) : null}
            {calc.cashflow != null ? (
              <KPI title="Cashflow vor Steuer" value={(calc.cashflow >= 0 ? "+" : "") + fmtEur(calc.cashflow)} sub="monatlich" badge={<Badge value={calc.cashflow} warn={0} good={100} />} />
            ) : (
              <KPI title="Cashflow vor Steuer" value="–" sub="Finanzierung eingeben" />
            )}
            {calc.cashflowNachSteuer != null ? (
              <KPI title="Cashflow nach Steuer" value={(calc.cashflowNachSteuer >= 0 ? "+" : "") + fmtEur(calc.cashflowNachSteuer)} sub="monatlich, inkl. Steuereffekt" badge={<Badge value={calc.cashflowNachSteuer} warn={0} good={100} />} />
            ) : null}
            {calc.ekRenditeNachSteuer != null ? (
              <KPI title="EK-Rendite" value={fmtPct(calc.ekRenditeNachSteuer)} sub="nach Steuer" badge={<Badge value={calc.ekRenditeNachSteuer} warn={4} good={8} />} />
            ) : calc.ekRendite != null ? (
              <KPI title="EK-Rendite" value={fmtPct(calc.ekRendite)} sub="vor Steuer" badge={<Badge value={calc.ekRendite} warn={4} good={8} />} />
            ) : null}
            {calc.steuerersparnis > 0 && (
              <KPI title="Steuerersparnis" value={fmtEur(calc.steuerersparnis)} sub="geschätzt p.a." />
            )}
            {calc.afaJahr != null && (
              <KPI title="AfA p.a." value={fmtEur(calc.afaJahr)} sub={`${calc.afaSatz} % vom Gebäudeanteil`} />
            )}
          </div>

          {compareCalc && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm space-y-2">
              <h3 className="font-semibold text-amber-800">⚖️ Vergleich mit gespeichertem Objekt</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="font-medium text-slate-500">Kennzahl</span>
                <span className="font-medium text-slate-500">Aktuell</span>
                <span className="font-medium text-slate-500">Gespeichert</span>
                {[
                  ["Brutto", fmtPct(calc.brutto), fmtPct(compareCalc.brutto)],
                  ["Netto", fmtPct(calc.netto), fmtPct(compareCalc.netto)],
                  ["Cashflow", cf != null ? fmtEur(cf) : "–", compareCalc.cashflow != null ? fmtEur(compareCalc.cashflow) : "–"],
                ].map(([label, a, b]) => (
                  <div key={label} className="contents">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-semibold">{a}</span>
                    <span className="font-semibold">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-semibold text-slate-700 text-sm mb-3">💰 Investitionskosten</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtEur(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-xs text-slate-600">{entry.name}</span>
                  <span className="text-xs font-semibold text-slate-800">{fmtEur(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {barData.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="font-semibold text-slate-700 text-sm mb-3">📅 Monatliche Ein- &amp; Ausgaben</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} layout="vertical" margin={{ left: 90, right: 40, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => fmtEur(v, 0)} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip formatter={(v) => [fmtEur(Math.abs(v)), ""]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {cf != null && (
                <div className={[
                  "mt-3 px-4 py-2 rounded-xl text-sm font-bold text-center",
                  cf >= 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200",
                ].join(" ")}>
                  Netto-Cashflow: {cf >= 0 ? "+" : ""}{fmtEur(cf)} / Monat
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={onSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition">
            💾 Objekt speichern
          </button>
          <button onClick={handleExportPdf} className="flex-1 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl text-sm transition">
            📄 Als PDF exportieren
          </button>
        </div>
        {saveMsg && <p className="text-xs text-center text-green-600">{saveMsg}</p>}

        <button onClick={onEdit} className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl text-sm">
          ✏️ Werte anpassen
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-3">📍 Lage-Benchmark</h3>
          <div className="space-y-2">
            {[
              {
                badge: "A", badgeColor: "bg-blue-100 text-blue-700",
                label: "A-Lage", sub: "München, Berlin, Köln",
                faktor: "28× – 35×", brutto: "2,8 % – 3,5 %",
                note: "Sehr wertstabil, aber meist negativer Cashflow.",
              },
              {
                badge: "B", badgeColor: "bg-green-100 text-green-700",
                label: "B-Lage", sub: "Münster, Essen, Bonn",
                faktor: "20× – 25×", brutto: "4,0 % – 5,0 %",
                note: "Guter Kompromiss aus Wertstabilität und Ertrag.",
              },
              {
                badge: "C", badgeColor: "bg-amber-100 text-amber-700",
                label: "C-Lage", sub: "Kleinere Städte / Umland",
                faktor: "14× – 18×", brutto: "5,5 % – 7,0 %",
                note: "Hoher Cashflow möglich, aber höheres Leerstand- und Wertrisiko.",
              },
            ].map((row) => (
              <div key={row.badge} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${row.badgeColor}`}>
                  {row.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-slate-800">{row.label}</span>
                    <span className="text-xs text-slate-400">{row.sub}</span>
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-slate-600">
                    <span>Faktor <strong>{row.faktor}</strong></span>
                    <span>Brutto <strong>{row.brutto}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{row.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
