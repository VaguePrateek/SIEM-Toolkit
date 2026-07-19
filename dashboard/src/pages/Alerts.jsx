import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import Pagination from "../components/shared/Pagination";
import {
  ShieldAlert, ShieldX, Shield, AlertTriangle, Info,
  Search, Filter, ChevronDown, ChevronUp, ExternalLink,
  RefreshCw
} from "lucide-react";

const severityConfig = {
  Critical: { color: "bg-red-500/15 text-red-400 border-red-500/20", icon: ShieldX, bar: "bg-red-500", bg: "bg-red-500/5" },
  High: { color: "bg-orange-500/15 text-orange-400 border-orange-500/20", icon: AlertTriangle, bar: "bg-orange-500", bg: "bg-orange-500/5" },
  Medium: { color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", icon: ShieldAlert, bar: "bg-yellow-500", bg: "bg-yellow-500/5" },
  Low: { color: "bg-green-500/15 text-green-400 border-green-500/20", icon: Shield, bar: "bg-green-500", bg: "bg-green-500/5" },
  Informational: { color: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: Info, bar: "bg-slate-500", bg: "bg-slate-500/5" },
};

const riskColors = {
  Critical: "bg-red-500/15 text-red-400 border-red-500/20",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Low: "bg-green-500/15 text-green-400 border-green-500/20",
  Informational: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

const SEVERITIES = ["Critical", "High", "Medium", "Low", "Informational"];

function FilterBar({ search, onSearchChange, severity, onSeverityChange, total }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="relative flex-1 w-full">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search IP, rule, description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-cyan-500/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-slate-500" />
        <select
          value={severity}
          onChange={(e) => onSeverityChange(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500/50 transition-all"
        >
          <option value="all">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full whitespace-nowrap">
        {total} total
      </span>
    </div>
  );
}

function AlertRow({ alert, index }) {
  const [expanded, setExpanded] = useState(false);
  const level = alert.risk?.level || alert.risk_level;
  const cfg = severityConfig[alert.severity] || severityConfig.Informational;
  const Icon = cfg.icon;
  const riskClass = riskColors[level] || riskColors.Informational;
  const hasAlertDetails = alert.alerts?.length > 0;

  return (
    <div
      className="rounded-xl border border-slate-800/50 overflow-hidden transition-all duration-200 hover:border-slate-700/50 animate-fade-in"
      style={{ animationDelay: `${(index % 20) * 40}ms` }}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${cfg.bg}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`p-2 rounded-lg ${cfg.color}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-200 truncate">
              {alert.event_type?.replace(/_/g, " ") || "Unknown"}
            </p>
            {hasAlertDetails && (
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-full">alerts</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {alert.source_ip || "unknown"} &middot; {alert.username || "system"} &middot;{" "}
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
        <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskClass}`}>
          {level}
        </span>
        <span className={`hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
          {alert.severity}
        </span>
        <span className="text-sm text-slate-500 font-mono hidden lg:block">
          {alert.risk?.score ?? alert.risk_score}
        </span>
        {expanded ? <ChevronUp size={16} className="text-slate-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
      </div>
      {expanded && (
        <div className="px-4 py-4 bg-slate-900/30 border-t border-slate-800/50 animate-fade-in space-y-4">
          {hasAlertDetails && (
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Detection Alerts</span>
              <div className="space-y-2">
                {alert.alerts.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div className={`p-1.5 rounded-lg ${severityConfig[a.severity]?.color || severityConfig.Informational.color}`}>
                      {(() => {
                        const C = severityConfig[a.severity]?.icon || Info;
                        return <C size={14} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200">{a.rule}</p>
                      <p className="text-xs text-slate-400">{a.description}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${severityConfig[a.severity]?.color || severityConfig.Informational.color}`}>
                      {a.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Source IP</span>
              <span className="text-slate-200 font-mono font-medium">{alert.source_ip || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Destination IP</span>
              <span className="text-slate-200 font-mono font-medium">{alert.destination_ip || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Port</span>
              <span className="text-slate-200 font-medium">{alert.port || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Protocol</span>
              <span className="text-slate-200 font-medium">{alert.protocol || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Risk Score</span>
              <span className="text-slate-200 font-medium">{alert.risk?.score ?? alert.risk_score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Username</span>
              <span className="text-slate-200 font-medium">{alert.username || "-"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-slate-500 block">Raw Log</span>
              <p className="text-slate-400 text-xs font-mono truncate mt-0.5">{alert.raw_log || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlertsPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const limit = 20;

  const fetchAlerts = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get("/alerts", { params: { page, limit } });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const alerts = data?.alerts || [];
  const filtered = alerts.filter((a) => {
    const level = a.risk?.level || a.risk_level;
    if (severity !== "all" && a.severity !== severity) return false;
    if (search) {
      const q = search.toLowerCase();
      const eventType = (a.event_type || "").toLowerCase();
      const ip = (a.source_ip || "").toLowerCase();
      const raw = (a.raw_log || "").toLowerCase();
      const usr = (a.username || "").toLowerCase();
      const rule = (a.alerts || []).some((al) => (al.rule || "").toLowerCase().includes(q));
      if (!eventType.includes(q) && !ip.includes(q) && !raw.includes(q) && !usr.includes(q) && !rule) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Alerts</h1>
          <p className="text-sm text-slate-500 mt-1">Security events that triggered detection rules</p>
        </div>
        <button
          onClick={() => fetchAlerts(true)}
          disabled={refreshing}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/50 hover:border-cyan-500/30 transition-all"
        >
          <RefreshCw size={16} className={`text-slate-400 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        severity={severity}
        onSeverityChange={setSeverity}
        total={data?.total_alerts || 0}
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-900/60 border border-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-400 mb-1">
            {search || severity !== "all" ? "No alerts match your filters" : "No alerts found"}
          </h3>
          <p className="text-sm text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert, i) => (
            <AlertRow key={alert.id || i} alert={alert} index={i} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={data?.total_pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
