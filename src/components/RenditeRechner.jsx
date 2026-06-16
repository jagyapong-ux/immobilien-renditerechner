import { useState, useMemo, useCallback } from "react";
import StartScreen from "./StartScreen";
import Wizard from "./Wizard";
import ResultsDashboard from "./ResultsDashboard";
import { DEFAULT_DATA, DEFAULT_SCENARIO } from "../constants/defaults";
import { calculate } from "../lib/calculations";
import { extractFromText } from "../lib/extract";
import { extractTextFromPdf } from "../lib/pdf";
import {
  loadProperties, saveProperty, deleteProperty, createPropertyName,
} from "../lib/storage";

export default function RenditeRechner() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [extractResult, setExtractResult] = useState(null);
  const [rawText, setRawText] = useState("");
  const [d, setD] = useState({ ...DEFAULT_DATA });
  const [skipped, setSkipped] = useState({});
  const [scenario, setScenario] = useState({ ...DEFAULT_SCENARIO });
  const [savedProperties, setSavedProperties] = useState(loadProperties);
  const [compareCalc, setCompareCalc] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const skip = (k, v) => setSkipped((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => calculate(d, skipped, scenario), [d, skipped, scenario]);

  const handlePdfFile = useCallback(async (file) => {
    setPdfFile(file);
    setPdfError(null);
    setExtractResult(null);
    setPdfLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      const found = extractFromText(text);
      setExtractResult({ found, fieldCount: Object.keys(found).length });
      setD((prev) => ({ ...prev, ...found }));
    } catch (err) {
      setPdfError(err.message || "Fehler beim Lesen des PDFs.");
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const handleTextExtract = () => {
    const found = extractFromText(rawText);
    setD((prev) => ({ ...prev, ...found }));
    setStep(1);
  };

  const reset = () => {
    setStep(0);
    setMethod(null);
    setPdfFile(null);
    setPdfLoading(false);
    setPdfError(null);
    setExtractResult(null);
    setRawText("");
    setD({ ...DEFAULT_DATA });
    setSkipped({});
    setScenario({ ...DEFAULT_SCENARIO });
    setCompareCalc(null);
    setSaveMsg(null);
  };

  const handleSave = () => {
    if (!calc) return;
    const property = {
      id: crypto.randomUUID(),
      name: createPropertyName(d),
      createdAt: new Date().toISOString(),
      data: { ...d },
      skipped: { ...skipped },
      summary: {
        brutto: calc.brutto,
        netto: calc.netto,
        cashflow: calc.cashflowNachSteuer ?? calc.cashflow,
        kp: calc.kp,
      },
    };
    const list = saveProperty(property);
    setSavedProperties(list);
    setSaveMsg("✅ Objekt gespeichert!");
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleLoadProperty = (p) => {
    setD({ ...DEFAULT_DATA, ...p.data });
    setSkipped(p.skipped || {});
    setStep(1);
    setCompareCalc(null);
  };

  const handleDeleteProperty = (id) => {
    setSavedProperties(deleteProperty(id));
  };

  const handleCompareProperty = (p) => {
    setCompareCalc(calculate(p.data, p.skipped || {}));
    setStep(6);
  };

  if (step === 0) {
    return (
      <StartScreen
        method={method}
        setMethod={setMethod}
        setStep={setStep}
        rawText={rawText}
        setRawText={setRawText}
        handleTextExtract={handleTextExtract}
        pdfFile={pdfFile}
        pdfLoading={pdfLoading}
        pdfError={pdfError}
        extractResult={extractResult}
        handlePdfFile={handlePdfFile}
        d={d}
        savedProperties={savedProperties}
        onLoadProperty={handleLoadProperty}
        onDeleteProperty={handleDeleteProperty}
        onCompareProperty={handleCompareProperty}
      />
    );
  }

  if (step >= 1 && step <= 5) {
    return (
      <Wizard
        step={step}
        setStep={setStep}
        d={d}
        set={set}
        skipped={skipped}
        skip={skip}
        calc={calc}
      />
    );
  }

  if (step === 6) {
    if (!calc) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-slate-600">Bitte erst einen Kaufpreis eingeben.</p>
          <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            ← Kaufpreis eingeben
          </button>
        </div>
      );
    }
    return (
      <ResultsDashboard
        calc={calc}
        d={d}
        skipped={skipped}
        scenario={scenario}
        setScenario={setScenario}
        compareCalc={compareCalc}
        onBack={() => setStep(5)}
        onReset={reset}
        onEdit={() => setStep(1)}
        onSave={handleSave}
        saveMsg={saveMsg}
      />
    );
  }

  return null;
}
