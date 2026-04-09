import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function MacroBreakdownCard({ chartData, totalCalories }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">Macro Split</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Balanced performance fuel</h2>
        </div>
        <div className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          {totalCalories} kcal
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="grams" nameKey="label" innerRadius={64} outerRadius={92} stroke="none">
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} g`, "Target"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/60">Daily</span>
            <span className="mt-2 text-3xl font-bold text-ink">{totalCalories}</span>
            <span className="text-sm text-slate">calories</span>
          </div>
        </div>
        <div className="grid gap-3 self-center">
          {chartData.map((item) => (
            <div key={item.key} className="rounded-2xl border border-slate/10 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-ink">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate">{item.percentage}%</span>
              </div>
              <p className="mt-2 text-sm text-slate">{item.grams} g target</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
