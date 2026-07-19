import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  Informational: "#22c55e",
  Low: "#06b6d4",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};

const DEFAULT_COLOR = "#64748b";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  const total = data.payload.total;
  const pct = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-sm font-medium text-slate-300">{data.name}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: data.color }}>
        {data.value.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {pct}% of total risk events
      </p>
    </div>
  );
};

const renderCenterLabel = (data) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan
        x="50%"
        dy="-8"
        className="text-3xl font-bold"
        fill="#f1f5f9"
        fontSize={32}
        fontWeight={700}
      >
        {total}
      </tspan>
      <tspan
        x="50%"
        dy="22"
        fill="#64748b"
        fontSize={13}
        fontWeight={500}
      >
        Total Risks
      </tspan>
    </text>
  );
};

export default function RiskChart({ risk }) {
  const data = Object.entries(risk || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/50 animate-scale-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">Risk Distribution</h2>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
          Severity Levels
        </span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={3}
            strokeWidth={2}
            stroke="#0a0f1e"
            animationBegin={200}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || DEFAULT_COLOR}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {renderCenterLabel(data)}
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[entry.name] || DEFAULT_COLOR }}
            />
            <span className="text-xs text-slate-400">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
