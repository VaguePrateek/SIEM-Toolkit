import { useState } from "react";
import {
  ShieldAlert,
  ShieldX,
  Shield,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

const severityConfig = {
  Critical: {
    color: "bg-red-500/15 text-red-400 border-red-500/20",
    icon: ShieldX,
    bar: "bg-red-500",
  },
  High: {
    color: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    icon: AlertTriangle,
    bar: "bg-orange-500",
  },
  Medium: {
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    icon: ShieldAlert,
    bar: "bg-yellow-500",
  },
  Low: {
    color: "bg-green-500/15 text-green-400 border-green-500/20",
    icon: Shield,
    bar: "bg-green-500",
  },
};

const riskColors = {
  Critical: "bg-red-500/15 text-red-400 border-red-500/20",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Low: "bg-green-500/15 text-green-400 border-green-500/20",
  Informational: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

export default function AlertsTable({ alerts }) {
  const [expanded, setExpanded] = useState(null);

  if (!alerts?.length) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 animate-scale-in">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={20} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">No alerts triggered yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/50 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
          {alerts.length} active
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const cfg = severityConfig[alert.severity] || severityConfig.Low;
          const Icon = cfg.icon;
          const level = alert.risk?.level || alert.risk_level;
          const riskClass = riskColors[level] || riskColors.Informational;
          const isExpanded = expanded === index;

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-800/50 overflow-hidden transition-all duration-200 hover:border-slate-700/50"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/20 cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : index)}
              >
                <div className={`p-2 rounded-lg ${cfg.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {alert.rule}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {alert.source_ip || "unknown"} &middot;{" "}
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskClass}`}
                >
                  {level || "Unknown"}
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />
                )}
              </div>
              {isExpanded && (
                <div className="px-4 py-3 bg-slate-900/30 border-t border-slate-800/50 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-slate-500 block">Severity</span>
                      <span className="text-slate-200 font-medium">{alert.severity}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Risk Score</span>
                      <span className="text-slate-200 font-medium">{alert.risk_score}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Source IP</span>
                      <span className="text-slate-200 font-mono font-medium">{alert.source_ip || "-"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Port</span>
                      <span className="text-slate-200 font-medium">{alert.port || "-"}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/50">
                    <span className="text-xs text-slate-500 block mb-1">Description</span>
                    <p className="text-sm text-slate-300">{alert.description}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
