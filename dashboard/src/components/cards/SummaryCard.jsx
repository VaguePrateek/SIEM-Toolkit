import { TrendingUp } from "lucide-react";

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    color = "text-cyan-400"
}) {

    return (
        <div className="
            bg-slate-900
            border border-slate-800
            rounded-2xl
            p-6
            hover:border-cyan-500
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
            hover:shadow-cyan-500/10
        ">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-slate-400 text-sm">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {value}
                    </h2>

                    <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">

                        <TrendingUp size={16}/>

                        <span>Live</span>

                    </div>

                </div>

                <div className={`${color}`}>
                    <Icon size={42}/>
                </div>

            </div>

        </div>
    )
}