import { Shield, Bell, UserCircle } from "lucide-react";

export default function Navbar() {
    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

            <div className="flex items-center gap-3">
                <Shield className="text-cyan-400" size={28}/>
                <h1 className="text-2xl font-bold">
                    SIEM Toolkit
                </h1>
            </div>

            <div className="flex items-center gap-6">

                <Bell size={22}/>

                <UserCircle size={30}/>

            </div>

        </header>
    )
}