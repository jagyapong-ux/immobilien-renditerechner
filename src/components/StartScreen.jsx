import SavedProperties from "./SavedProperties";

export default function StartScreen({
  setStep,
  savedProperties, onLoadProperty, onDeleteProperty, onCompareProperty,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-3 shadow-lg">
            <span className="text-2xl">🏠</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Renditerechner</h1>
          <p className="text-slate-500 text-sm mt-1">Immobilien-Investment — schnell &amp; transparent</p>
        </div>

        <SavedProperties
          properties={savedProperties}
          onLoad={onLoadProperty}
          onDelete={onDeleteProperty}
          onCompare={onCompareProperty}
        />

        <button
          onClick={() => setStep(1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition"
        >
          Wizard starten →
        </button>
      </div>
    </div>
  );
}
