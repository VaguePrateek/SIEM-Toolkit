import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress >= 1) {
        prev.current = value;
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

const gradients = {
  cyan: "card-gradient-cyan border-cyan-500/20",
  purple: "card-gradient-purple border-purple-500/20",
  amber: "card-gradient-amber border-amber-500/20",
  red: "card-gradient-red border-red-500/20",
  green: "card-gradient-green border-green-500/20",
};

const iconBg = {
  cyan: "bg-cyan-500/15 text-cyan-400",
  purple: "bg-purple-500/15 text-purple-400",
  amber: "bg-amber-500/15 text-amber-400",
  red: "bg-red-500/15 text-red-400",
  green: "bg-green-500/15 text-green-400",
};

const accentColors = {
  cyan: "cyan",
  purple: "purple",
  amber: "amber",
  red: "red",
  green: "green",
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  color = "cyan",
  subtitle,
  trend = "up",
}) {
  const gradient = gradients[color] || gradients.cyan;
  const iconStyle = iconBg[color] || iconBg.cyan;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${gradient} bg-slate-900/60 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group animate-scale-in`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className={`p-2.5 rounded-xl ${iconStyle} transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon size={20} />
          </div>
        </div>
        <div className="mt-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            <AnimatedNumber value={value || 0} />
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          {trend === "up" ? (
            <TrendingUp size={14} className="text-green-400" />
          ) : (
            <TrendingDown size={14} className="text-red-400" />
          )}
          <span className="text-xs font-medium text-green-400">Live</span>
        </div>
      </div>
    </div>
  );
}
