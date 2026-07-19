import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import Pagination from "../components/shared/Pagination";
import {
  Search, Filter, ChevronDown, ChevronUp, Database,
  RefreshCw, Shield, ShieldAlert, AlertTriangle, Info
} from "lucide-react";

const riskColors = {
  Critical: "bg-red-500/15 text-red-400 border-red-500/20",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Low: "bg-green-500/15 text-green-400 border-green-500/20",
  Informational: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

const severityIcons = {
  critical: ShieldAlert, high: AlertTriangle, medium: ShieldAlert, low: Shield, info: Info,
};

const EVENT_TYPES = ["failed_login", "successful_login", "port_scan", "malware", "network_connection", "unknown"];

function FilterBar({ search, onSearchChange, typeFilter, onTypeChange, riskFilter, onRiskChange, total }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="relative flex-1 w-full">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search IP, username, raw log..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-cyan-500/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-slate-500" />
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500/50 transition-all"
        >
          <option value="all">All Types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => onRiskChange(e.target.value)}
          className="bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500/50 transition-all"
        >
          <option value="all">All Risk Levels</option>
          {Object.keys(riskColors).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full whitespace-nowrap">
        {total} total
      </span>
    </div>
  );
}

function EventRow({ event, index }) {
  const [expanded, setExpanded] = useState(false);
  const level = event.risk?.level || event.risk_level;
  const riskClass = riskColors[level] || riskColors.Informational;
  const isThreat = event.ml_prediction?.prediction === 1;
  const hasAlerts = event.alerts?.length > 0;
  const SeverityIcon = severityIcons[event.severity] || Info;

  return (
    <div
      className="rounded-xl border border-slate-800/50 overflow-hidden transition-all duration-200 hover:border-slate-700/50 animate-fade-in"
      style={{ animationDelay: `${(index % 20) * 40}ms` }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5 bg-slate-800/20 cursor-pointer hover:bg-slate-800/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-2 h-2 rounded-full bg-cyan-500/50 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate capitalize">
              {event.event_type?.replace(/_/g, " ") || "Unknown"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {event.source_ip || "?"} &middot; {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskClass}`}>
          {level}
        </span>
        {isThreat && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">
            Threat
          </span>
        )}
        {!isThreat && (
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            Safe
          </span>
        )}
        {hasAlerts && (
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <AlertTriangle size={10} />
            {event.alerts.length}
          </span>
        )}
        {expanded ? <ChevronUp size={16} className="text-slate-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
      </div>
      {expanded && (
        <div className="px-4 py-4 bg-slate-900/30 border-t border-slate-800/50 animate-fade-in space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Event Type</span>
              <span className="text-slate-200 font-medium capitalize">{event.event_type?.replace(/_/g, " ") || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Severity</span>
              <span className="text-slate-200 font-medium capitalize">{event.severity || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Source IP</span>
              <span className="text-slate-200 font-mono font-medium">{event.source_ip || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Destination IP</span>
              <span className="text-slate-200 font-mono font-medium">{event.destination_ip || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Port</span>
              <span className="text-slate-200 font-medium">{event.port || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Protocol</span>
              <span className="text-slate-200 font-medium">{event.protocol || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Username</span>
              <span className="text-slate-200 font-medium">{event.username || "-"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Risk Score</span>
              <span className="text-slate-200 font-medium">{event.risk?.score ?? event.risk_score}</span>
            </div>
          </div>
          {hasAlerts && (
            <div className="pt-3 border-t border-slate-800/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Triggered Alerts</span>
              <div className="space-y-1.5">
                {event.alerts.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                    <span className="font-medium">{a.rule}:</span>
                    <span className="text-slate-400">{a.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="pt-3 border-t border-slate-800/50">
            <span className="text-xs text-slate-500 block mb-1">Raw Log</span>
            <p className="text-sm text-slate-400 font-mono bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              {event.raw_log || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const limit = 20;

  const fetchEvents = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get("/events", { params: { page, limit } });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const events = data?.events || [];
  const filtered = events.filter((e) => {
    const level = e.risk?.level || e.risk_level;
    if (typeFilter !== "all" && e.event_type !== typeFilter) return false;
    if (riskFilter !== "all" && level !== riskFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const type = (e.event_type || "").toLowerCase();
      const ip = (e.source_ip || "").toLowerCase();
      const raw = (e.raw_log || "").toLowerCase();
      const usr = (e.username || "").toLowerCase();
      if (!type.includes(q) && !ip.includes(q) && !raw.includes(q) && !usr.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Events</h1>
          <p className="text-sm text-slate-500 mt-1">All security events with risk assessment and ML analysis</p>
        </div>
        <button
          onClick={() => fetchEvents(true)}
          disabled={refreshing}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/50 hover:border-cyan-500/30 transition-all"
        >
          <RefreshCw size={16} className={`text-slate-400 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        riskFilter={riskFilter}
        onRiskChange={setRiskFilter}
        total={data?.total_events || 0}
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
            <Database size={28} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-400 mb-1">
            {search || typeFilter !== "all" || riskFilter !== "all" ? "No events match your filters" : "No events found"}
          </h3>
          <p className="text-sm text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event, i) => (
            <EventRow key={event.id || i} event={event} index={i} />
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
