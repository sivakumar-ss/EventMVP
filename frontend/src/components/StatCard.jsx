export function StatCard({ icon: Icon, label, value, sub, color = 'indigo', trend }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/20',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
    rose: 'from-rose-500 to-rose-600 shadow-rose-500/20',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-44 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-full" />
        <div className="h-3 skeleton rounded-lg w-5/6" />
        <div className="space-y-2 pt-2">
          <div className="h-3 skeleton rounded-lg w-1/2" />
          <div className="h-3 skeleton rounded-lg w-2/3" />
        </div>
        <div className="h-9 skeleton rounded-xl mt-4" />
      </div>
    </div>
  );
}
