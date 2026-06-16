function SliderWithBubble({ label, min, max, step, value, displayValue, onChange }) {
  const percent = (value - min) / (max - min) * 100;
  const thumbCorrection = 8 - (percent / 100) * 16;

  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      <div className="relative pt-6">
        <div
          className="absolute -top-0.5 pointer-events-none"
          style={{ left: `calc(${percent}% + ${thumbCorrection}px)`, transform: "translateX(-50%)" }}
        >
          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow">
            {displayValue}
          </span>
          <div className="w-0 h-0 mx-auto border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600" />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full accent-blue-600"
        />
      </div>
    </div>
  );
}

export default function ScenarioSliders({ scenario, onChange, baseZins = 0, baseKm = null }) {
  const absZins = baseZins + (scenario.zinsAdj ?? 0);
  const maxZins = Math.max(baseZins + 3, 10);
  const absKm = baseKm != null ? Math.round(baseKm * (1 + (scenario.mieteAdj ?? 0) / 100)) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
      <h3 className="font-semibold text-slate-700 text-sm">🔮 Was-wäre-wenn-Szenarien</h3>

      <SliderWithBubble
        label="Miete anpassen"
        min={-100}
        max={100}
        step={1}
        value={scenario.mieteAdj}
        displayValue={absKm != null ? `${Math.max(0, absKm)} €` : `${scenario.mieteAdj >= 0 ? "+" : ""}${scenario.mieteAdj} %`}
        onChange={(e) => onChange({ ...scenario, mieteAdj: Number(e.target.value) })}
      />

      <SliderWithBubble
        label="Zinssatz"
        min={0}
        max={maxZins}
        step={0.1}
        value={absZins}
        displayValue={`${absZins.toFixed(1).replace(".", ",")} %`}
        onChange={(e) => onChange({ ...scenario, zinsAdj: Number((Number(e.target.value) - baseZins).toFixed(1)) })}
      />

      {(scenario.mieteAdj !== 0 || scenario.zinsAdj !== 0) && (
        <button
          onClick={() => onChange({ mieteAdj: 0, zinsAdj: 0 })}
          className="text-xs text-blue-500 hover:underline"
        >
          Szenario zurücksetzen
        </button>
      )}
    </div>
  );
}
