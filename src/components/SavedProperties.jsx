import { fmtEur, fmtPct } from "../lib/format";

export default function SavedProperties({ properties, onLoad, onDelete, onCompare }) {
  if (!properties.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      <h3 className="font-semibold text-slate-700 text-sm">💾 Gespeicherte Objekte</h3>
      <div className="space-y-2">
        {properties.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
              <p className="text-xs text-slate-400">
                {p.summary?.brutto != null ? `Brutto ${fmtPct(p.summary.brutto)}` : "–"}
                {p.summary?.cashflow != null ? ` · CF ${fmtEur(p.summary.cashflow)}/M` : ""}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onLoad(p)}
                className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg hover:bg-blue-700"
              >
                Laden
              </button>
              <button
                onClick={() => onCompare(p)}
                className="text-xs border border-slate-300 px-2.5 py-1 rounded-lg hover:bg-white"
              >
                Vergleich
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="text-xs text-red-500 px-1.5 py-1 hover:underline"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
