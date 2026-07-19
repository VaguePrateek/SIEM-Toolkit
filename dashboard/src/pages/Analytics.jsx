import { useEffect, useState } from "react";
import api from "../api/api";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  BarChart3, TrendingUp, Activity, RefreshCw, Brain,
  Globe, Server, Shield, AlertTriangle
} from "lucide-react";

const CHART_COLORS = {
  Informational: "#22c55e",
  Low: "#06b6d4",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};

const PIE_COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e", "#f97316", "#eab308"];

function StatCard({ icon: Icon, label, value, sub, color = "cyan" }) {
  const colorMap = { cyan: "from-cyan-500/10 to-blue-600/10 border-cyan-500/20 text-cyan-400", amber: "from-amber-500/10 to-orange-600/10 border-amber-500/20 text-amber-400", purple: "from-purple-500/10 to-pink-600/10 border-purple-500/20 text-purple-400", red: "from-red-500/10 to-rose-600/10 border-red-500/20 text-red-400" };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colorMap[color]} bg-slate-900/60 backdrop-blur-sm p-5`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <Icon size={20} className="opacity-80" />
      </div>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <p className="text-2xl font-bold text-cyan-400 mt-1">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800/50 animate-pulse" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800/50 animate-pulse" />
          <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-12 text-center">
        <BarChart3 size={32} className="text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">Failed to load analytics data</p>
      </div>
    );
  }

  const riskData = Object.entries(stats.risk_levels || {}).map(([name, value]) => ({ name, value }));
  const eventData = Object.entries(stats.event_types || {}).map(([name, value]) => ({ name: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value }));
  const topIpsData = (stats.top_source_ips || []).map((d) => ({ name: d.ip, value: d.count }));
  const topPortsData = (stats.top_ports || []).map((d) => ({ name: `Port ${d.port}`, value: d.count }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Statistical analysis and security intelligence</p>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/50 hover:border-cyan-500/30 transition-all">
          <RefreshCw size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Total Events" value={stats.total_events} sub="All recorded events" color="cyan" />
        <StatCard icon={Shield} label="Total Alerts" value={stats.total_alerts} sub="Rule-triggered alerts" color="amber" />
        <StatCard icon={AlertTriangle} label="Critical Threats" value={stats.risk_levels?.Critical || 0} sub="High-severity events" color="red" />
        <StatCard icon={Brain} label="ML Threats" value={stats.ml_threats} sub="AI-predicted threats" color="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Risk Level Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                innerRadius={70} outerRadius={120}
                paddingAngle={3} strokeWidth={2} stroke="#0a0f1e"
                animationBegin={200} animationDuration={1000}
              >
                {riskData.map((entry) => (
                  <Cell key={entry.name} fill={CHART_COLORS[entry.name] || "#64748b"} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Event Type Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="eventBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
              <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(6,182,212,0.08)" }} />
              <Bar dataKey="value" fill="url(#eventBarGradient)" radius={[6, 6, 0, 0]} maxBarSize={50} animationBegin={300} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Top Source IPs</h2>
            <Globe size={18} className="text-slate-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topIpsData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(139,92,246,0.08)" }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} maxBarSize={30} animationBegin={400} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Top Ports</h2>
            <Server size={18} className="text-slate-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topPortsData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(6,182,212,0.08)" }} />
              <Bar dataKey="value" fill="#06b6d4" radius={[0, 6, 6, 0]} maxBarSize={30} animationBegin={500} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
