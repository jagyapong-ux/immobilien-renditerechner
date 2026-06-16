import { useState, useRef, useCallback } from "react";

export default function PdfUploadZone({ onFile, loading, fileName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") onFile(f);
  }, [onFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && inputRef.current?.click()}
      className={[
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition",
        dragging
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 bg-white",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f); }}
      />
      {loading ? (
        <div className="space-y-2">
          <div className="text-3xl animate-pulse">⏳</div>
          <p className="text-sm font-medium text-blue-600">PDF wird ausgelesen …</p>
        </div>
      ) : fileName ? (
        <div className="space-y-2">
          <div className="text-3xl">✅</div>
          <p className="text-sm font-semibold text-slate-700">{fileName}</p>
          <p className="text-xs text-blue-500 hover:underline">Andere Datei wählen</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-4xl">📄</div>
          <p className="text-sm font-semibold text-slate-700">PDF hier ablegen oder klicken</p>
          <p className="text-xs text-slate-400">
            Exposé als PDF — Kaufpreis, Miete &amp; Fläche werden automatisch erkannt
          </p>
        </div>
      )}
    </div>
  );
}
