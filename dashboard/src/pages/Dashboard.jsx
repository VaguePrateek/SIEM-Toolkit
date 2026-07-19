import { useEffect, useState, useCallback } from "react";
import RiskChart from "../components/charts/RiskChart";
import EventChart from "../components/charts/EventChart";
import EventsTable from "../components/tables/EventTable";
import AlertsTable from "../components/tables/AlertTable";
import api from "../api/api";
import SummaryCard from "../components/cards/SummaryCard";
import { Database, ShieldAlert, AlertTriangle, Brain, RefreshCw } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-5 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-8 w-24 bg-slate-800 rounded" />
        </div>
        <div className="h-10 w-10 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 animate-pulse">
      <div className="h-5 w-32 bg-slate-800 rounded mb-6" />
      <div className="h-64 bg-slate-800/50 rounded-xl" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 animate-pulse">
      <div className="h-5 w-28 bg-slate-800 rounded mb-4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/50 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function StatusBar({ lastUpdated, refreshing, onRefresh }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Security Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time security event monitoring and threat analysis
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-slate-400">
            {lastUpdated ? `Updated ${lastUpdated}` : "Connecting..."}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={`text-slate-400 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      const [statsRes, alertsRes, eventsRes] = await Promise.all([
        api.get("/stats"),
        api.get("/alerts"),
        api.get("/events"),
      ]);

      setStats(statsRes.data);
      setAlerts(alertsRes.data.alerts || []);
      setEvents(eventsRes.data.events || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Failed to connect to backend. Make sure the API server is running on port 8000.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => loadDashboard(true), 15000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-fade-in">
        <StatusBar lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={() => loadDashboard(true)} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <SkeletonTable />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <StatusBar lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={() => loadDashboard(true)} />
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Connection Error</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => loadDashboard()}
            className="px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const critical = stats?.risk_levels?.Critical || 0;
  const mlThreats = stats?.ml_threats || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <StatusBar lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={() => loadDashboard(true)} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Events"
          value={stats.total_events}
          icon={Database}
          color="cyan"
          subtitle="All recorded security events"
        />
        <SummaryCard
          title="Alerts Triggered"
          value={stats.total_alerts}
          icon={ShieldAlert}
          color="amber"
          subtitle="Signature-based rule matches"
        />
        <SummaryCard
          title="Critical Threats"
          value={critical}
          icon={AlertTriangle}
          color="red"
          subtitle="High-severity risk events"
        />
        <SummaryCard
          title="ML Predicted Threats"
          value={mlThreats}
          icon={Brain}
          color="purple"
          subtitle="Random Forest predictions"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RiskChart risk={stats.risk_levels} />
        <EventChart events={stats.event_types} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AlertsTable alerts={alerts} />
        <EventsTable events={events} />
      </div>
    </div>
  );
}

