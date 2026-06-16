export default function KPI({ title, value, sub, badge }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xl font-bold text-slate-800">{value}</span>
        {badge}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
