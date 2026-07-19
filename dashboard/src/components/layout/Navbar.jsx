import { Shield, Bell, Search, UserCircle, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Security Operations Center
            </p>
            <p className="text-lg font-bold text-white">
              {mounted ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-lg group">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors"
            />
            <input
              type="text"
              placeholder="Search IP, username, event type..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:bg-slate-900 focus:shadow-lg focus:shadow-cyan-500/5"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-500 font-mono">
              /
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs text-slate-400 font-medium">Live</span>
          </div>

          <button className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all duration-200 group">
            <Bell size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-900" />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
              <UserCircle size={28} className="text-cyan-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-white leading-tight">Admin</p>
              <p className="text-xs text-slate-500">SOC Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
