export default function Badge({ value, warn, good, higherIsBetter = true }) {
  if (value == null || isNaN(value)) return null;
  let cls, label;
  if (higherIsBetter) {
    if (value >= good) [cls, label] = ["bg-green-100 text-green-700 border-green-300", "Gut"];
    else if (value >= warn) [cls, label] = ["bg-yellow-100 text-yellow-700 border-yellow-300", "Ok"];
    else [cls, label] = ["bg-red-100 text-red-700 border-red-300", "Schwach"];
  } else {
    if (value <= warn) [cls, label] = ["bg-green-100 text-green-700 border-green-300", "Gut"];
    else if (value <= good) [cls, label] = ["bg-yellow-100 text-yellow-700 border-yellow-300", "Ok"];
    else [cls, label] = ["bg-red-100 text-red-700 border-red-300", "Teuer"];
  }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}
