import { useEffect, useState } from "react";
import api from "../api/api";
import {
  Settings, Server, Database, Shield, Bell, Moon,
  RefreshCw, Check, Copy, ExternalLink, Activity,
  Cpu, HardDrive, Globe, Wifi, Clock, Info
} from "lucide-react";

function SettingCard({ icon: Icon, title, description, children, color = "cyan" }) {
  const borderMap = { cyan: "border-cyan-500/20", purple: "border-purple-500/20", amber: "border-amber-500/20", green: "border-green-500/20" };
  const bgMap = { cyan: "from-cyan-500/5 to-transparent", purple: "from-purple-500/5 to-transparent", amber: "from-amber-500/5 to-transparent", green: "from-green-500/5 to-transparent" };
  return (
    <div className={`rounded-2xl border ${borderMap[color]} bg-slate-900/60 backdrop-blur-sm bg-gradient-to-br ${bgMap[color]} p-6 animate-scale-in`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
          <Icon size={20} className={`text-${color}-400`} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/30 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-medium text-slate-200 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
        setApiStatus("online");
      } catch {
        setApiStatus("offline");
      }
    }
    check();
  }, []);

  const copyEndpoint = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">System configuration and API information</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingCard icon={Server} title="API Connection" description="Backend server configuration" color="cyan">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${apiStatus === "online" ? "bg-green-500" : apiStatus === "checking" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
                <div>
                  <p className="text-sm font-medium text-slate-200">API Status</p>
                  <p className="text-xs text-slate-500 capitalize">{apiStatus}</p>
                </div>
              </div>
              <span className="text-sm font-mono text-slate-400">http://127.0.0.1:8000</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["/stats", "/events", "/alerts", "/analyze"].map((ep) => (
                <button
                  key={ep}
                  onClick={() => copyEndpoint(`http://127.0.0.1:8000${ep}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/30 text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all font-mono"
                >
                  {ep}
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              ))}
            </div>
          </div>
        </SettingCard>

        <SettingCard icon={Database} title="Database Statistics" description="SQLite storage overview" color="purple">
          <div className="space-y-1">
            <InfoRow label="Total Events" value={(stats?.total_events || 0).toLocaleString()} />
            <InfoRow label="Total Alerts" value={(stats?.total_alerts || 0).toLocaleString()} />
            <InfoRow label="ML Threats" value={(stats?.ml_threats || 0).toLocaleString()} />
            <InfoRow label="Risk Levels Tracked" value={Object.keys(stats?.risk_levels || {}).length.toString()} />
            <InfoRow label="Event Types" value={Object.keys(stats?.event_types || {}).length.toString()} />
          </div>
        </SettingCard>

        <SettingCard icon={Activity} title="Detection Rules" description="Active security rules" color="amber">
          <div className="space-y-1">
            <InfoRow label="Brute Force Login" value="5+ failures / 60s" />
            <InfoRow label="Port Scan" value="Reconnaissance detection" />
            <InfoRow label="Malware Detected" value="Malware indicator" />
            <InfoRow label="Sensitive Port Access" value="21, 22, 23, 445, 3389" />
          </div>
        </SettingCard>

        <SettingCard icon={Brain} title="ML Model" description="Random Forest classifier" color="green">
          <div className="space-y-1">
            <InfoRow label="Model" value="Random Forest" />
            <InfoRow label="Prediction" value="Binary (0 = benign, 1 = threat)" />
            <InfoRow label="Features" value="Hour, severity, port, protocol, etc." />
            <InfoRow label="Training" value="Historical DB events" />
            <InfoRow label="Storage" value="ml/models/random_forest.pkl" />
          </div>
        </SettingCard>

        <SettingCard icon={Info} title="About" description="SIEM Toolkit information" color="purple">
          <div className="space-y-1">
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Backend" value="Python + FastAPI" />
            <InfoRow label="Frontend" value="React 19 + Tailwind CSS 4" />
            <InfoRow label="Database" value="SQLite" />
            <InfoRow label="ML Library" value="scikit-learn (joblib)" />
          </div>
        </SettingCard>

        <SettingCard icon={Shield} title="Security" description="Risk scoring configuration" color="red">
          <div className="space-y-1">
            <InfoRow label="Score Range" value="0 - 100" />
            <InfoRow label="Critical" value="80 - 100" />
            <InfoRow label="High" value="60 - 79" />
            <InfoRow label="Medium" value="40 - 59" />
            <InfoRow label="Low" value="20 - 39" />
            <InfoRow label="Informational" value="0 - 19" />
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
