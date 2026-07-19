import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const riskColors = {
  Critical: "bg-red-500/15 text-red-400 border-red-500/20",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Low: "bg-green-500/15 text-green-400 border-green-500/20",
  Informational: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

const mlColors = {
  true: "bg-red-500/15 text-red-400",
  false: "bg-emerald-500/15 text-emerald-400",
};

export default function EventsTable({ events }) {
  const [expanded, setExpanded] = useState(null);

  if (!events?.length) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 animate-scale-in">
        <h2 className="text-lg font-semibold text-white mb-4">Latest Events</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
            <ExternalLink size={20} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">No events recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700/50 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Latest Events</h2>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
          {events.length} recent
        </span>
      </div>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Event
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Source IP
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Port
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                ML
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => {
              const level = event.risk?.level || event.risk_level;
              const riskClass = riskColors[level] || riskColors.Informational;
              const isThreat = event.ml_prediction?.prediction === 1;
              const mlClass = mlColors[isThreat ? "true" : "false"];

              return (
                <tr
                  key={event.id || index}
                  className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-all duration-150 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
                      <span className="text-sm font-medium text-slate-200 capitalize">
                        {event.event_type?.replace(/_/g, " ") || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-400">
                    {event.username || (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-mono text-slate-300">
                      {event.source_ip || (
                        <span className="text-slate-600">-</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-400 hidden md:table-cell">
                    {event.port || (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskClass}`}
                    >
                      {level || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${mlClass}`}
                    >
                      {isThreat ? "Threat" : "Safe"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
