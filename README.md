# Renditerechner

Immobilien-Renditerechner im Stil von Immocation — mit Wizard, PDF-Import, Steuer/AfA, Szenario-Slidern und Objektvergleich.

## Features

- **Wizard** mit 5 Schritten (Objekt → Nebenkosten → Miete → Finanzierung → Steuer)
- **PDF-Upload** — Exposé automatisch auslesen
- **Text-Import** — Copy & Paste aus Web-Exposés
- **Steuer & AfA** — vereinfachte Berechnung inkl. Steuerersparnis
- **Szenario-Slider** — Miete ±20 %, Zins ±1–2 %
- **LocalStorage** — bis zu 20 Objekte speichern & vergleichen
- **PDF-Export** — Ergebnis als PDF herunterladen

## Voraussetzungen

[Node.js](https://nodejs.org/) (Version 18+) muss installiert sein.

## Installation & Start

```bash
cd ~/claude-projects/renditerechner
npm install
npm run dev
```

Die App läuft dann unter `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```
