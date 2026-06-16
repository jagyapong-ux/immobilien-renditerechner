const STORAGE_KEY = "renditerechner-properties";

export const loadProperties = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveProperty = (property) => {
  const list = loadProperties();
  const idx = list.findIndex((p) => p.id === property.id);
  if (idx >= 0) list[idx] = property;
  else list.unshift(property);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  return list;
};

export const deleteProperty = (id) => {
  const list = loadProperties().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
};

export const createPropertyName = (data) => {
  const kp = data.kaufpreis ? `${Number(data.kaufpreis).toLocaleString("de-DE")} €` : "Unbenannt";
  const ort = data.bundesland || "";
  return ort ? `${kp} · ${ort}` : kp;
};
