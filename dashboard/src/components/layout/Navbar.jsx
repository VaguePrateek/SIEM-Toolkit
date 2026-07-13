import {
    Shield,
    Bell,
    Search,
    UserCircle,
    Activity
} from "lucide-react";

export default function Navbar() {
    return (
        <header
            className="
                sticky
                top-0
                z-40
                bg-slate-950/90
                backdrop-blur-lg
                border-b
                border-slate-800
                shadow-lg
                shadow-black/20
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    px-8
                    py-4
                "
            >
                {/* ================= LEFT ================= */}

                <div className="flex items-center gap-4">

                    <div
                        className="
                            p-3
                            rounded-xl
                            bg-cyan-500/10
                            border
                            border-cyan-500/20
                        "
                    >
                        <Shield
                            size={28}
                            className="text-cyan-400"
                        />
                    </div>

                    <div>

                        <h1 className="text-xl font-bold text-white">
                            SIEM Toolkit
                        </h1>

                        <p className="text-xs text-slate-400">
                            Machine Learning Security Information & Event Management
                        </p>

                    </div>

                </div>

                {/* ================= CENTER ================= */}

                <div className="hidden lg:flex flex-1 justify-center">

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            w-full
                            max-w-md
                            px-4
                            py-2.5
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                            hover:border-cyan-500
                            transition-all
                            duration-300
                        "
                    >

                        <Search
                            size={18}
                            className="text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search IP, Username, Event..."
                            className="
                                bg-transparent
                                outline-none
                                flex-1
                                text-sm
                                text-white
                                placeholder:text-slate-500
                            "
                        />

                    </div>

                </div>

                {/* ================= RIGHT ================= */}

                <div className="flex items-center gap-4">

                    {/* Live Backend Status */}

                    <div
                        className="
                            hidden
                            md:flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                        "
                    >

                        <Activity
                            size={16}
                            className="text-green-400 animate-pulse"
                        />

                        <span className="text-sm text-slate-300">
                            Backend Online
                        </span>

                    </div>

                    {/* Notifications */}

                    <button
                        className="
                            relative
                            p-3
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                            hover:border-cyan-500
                            hover:bg-slate-800
                            hover:scale-105
                            transition-all
                            duration-300
                        "
                    >

                        <Bell
                            size={20}
                            className="text-slate-300"
                        />

                        <span
                            className="
                                absolute
                                top-2
                                right-2
                                w-2.5
                                h-2.5
                                rounded-full
                                bg-red-500
                                animate-pulse
                            "
                        />

                    </button>

                    {/* User */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                            hover:border-cyan-500
                            transition-all
                            duration-300
                        "
                    >

                        <UserCircle
                            size={34}
                            className="text-cyan-400"
                        />

                        <div className="hidden md:block">

                            <p className="text-sm font-semibold text-white">
                                Admin
                            </p>

                            <p className="text-xs text-slate-400">
                                SOC Analyst
                            </p>

                        </div>

                    </div>

                </div>
            </div>
        </header>
    );
}