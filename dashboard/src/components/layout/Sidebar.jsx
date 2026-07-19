import { useState } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Database,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Alerts", icon: ShieldAlert, path: "/alerts" },
  { name: "Events", icon: Database, path: "/events" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col">
        <div className="flex items-center gap-3 p-5 border-b border-slate-800/50">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Shield size={22} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">SIEM</span>
              <span className="text-slate-400 ml-1">Toolkit</span>
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {menu.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                style={{ animationDelay: `${index * 60}ms` }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                    )}
                    <Icon
                      size={20}
                      className={`shrink-0 transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                    {isActive && !collapsed && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
