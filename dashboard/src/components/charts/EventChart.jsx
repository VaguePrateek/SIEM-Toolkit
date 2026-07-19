import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-sm font-medium text-slate-300 capitalize">{label}</p>
      <p className="text-2xl font-bold text-cyan-400 mt-1">
        {payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500 mt-1">events</p>
    </div>
  );
};

export default function EventChart({ events }) {
  const data = Object.entries(events || {}).map(([name, value]) => ({
    name: name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value,
  }));

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/50 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Event Types</h2>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
          Distribution
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#475569"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#1e293b" }}
            tickLine={false}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6,182,212,0.08)" }} />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
            animationBegin={200}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
