import { useState, useCallback } from "react";
import { loadProperties, saveProperty, deleteProperty, createPropertyName } from "../lib/storage";
import { calculate } from "../lib/calculations";

export const useSavedProperties = () => {
  const [saved, setSaved] = useState(loadProperties);

  const persist = useCallback((data, skipped) => {
    const calc = calculate(data, skipped);
    const property = {
      id: crypto.randomUUID(),
      name: createPropertyName(data),
      createdAt: new Date().toISOString(),
      data: { ...data },
      skipped: { ...skipped },
      summary: {
        brutto: calc?.brutto,
        netto: calc?.netto,
        cashflow: calc?.cashflow,
        ekRendite: calc?.ekRendite,
      },
    };
    setSaved(saveProperty(property));
    return property;
  }, []);

  const remove = useCallback((id) => {
    setSaved(deleteProperty(id));
  }, []);

  const load = useCallback((property) => property, []);

  return { saved, persist, remove, load };
};
