export default function Field({
  label, value, onChange, suffix, placeholder, help, onSkip, isSkipped, required,
}) {
  if (isSkipped) {
    return (
      <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
        <span className="text-sm text-slate-400 italic">{label} — übersprungen</span>
        <button type="button" onClick={() => onSkip(false)} className="text-xs text-blue-500 hover:underline">
          Eingeben
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {onSkip && (
          <button type="button" onClick={() => onSkip(true)} className="text-xs text-slate-400 hover:text-slate-600">
            ↪ Überspringen
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ""}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          style={{ paddingRight: suffix ? "2.5rem" : undefined }}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {help && <p className="text-xs text-slate-400">{help}</p>}
    </div>
  );
}
