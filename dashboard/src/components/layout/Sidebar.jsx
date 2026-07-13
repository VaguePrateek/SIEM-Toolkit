import {
    LayoutDashboard,
    ShieldAlert,
    Database,
    BarChart3,
    Settings
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
    return (
        <aside className="fixed left-0 top-0 h-screen w-64bg-slate-900 border-rborder-slate-800z-50">

            <div className="p-6 text-2xl font-bold">
                SIEM Toolkit
            </div>

            <nav className="px-4">

                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg mb-2 transition ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}

            </nav>

        </aside>
    );
}