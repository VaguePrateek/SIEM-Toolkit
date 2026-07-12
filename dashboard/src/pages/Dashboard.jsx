import {useEffect, useState} from "react";
import RiskChart from "../components/charts/RiskChart";
import EventChart from "../components/charts/EventChart";
import api from "../api/api";

import SummaryCard from "../components/cards/SummaryCard";

import {
    Database,
    ShieldAlert,
    AlertTriangle,
    Brain
} from "lucide-react";

export default function Dashboard(){

    const [stats,setStats]=useState(null);

    useEffect(()=>{

        api.get("/stats")
            .then(res=>setStats(res.data))
            .catch(console.error);

    },[]);

    if(!stats){

        return(
            <div className="text-xl">
                Loading Dashboard...
            </div>
        )
    }

    const critical =
        stats.risk_levels.Critical || 0;

    return(

        <div className="space-y-8">

            <h1 className="text-4xl font-bold">
                Security Dashboard
            </h1>

            <div className="
                grid
                gap-6
                md:grid-cols-2
                xl:grid-cols-4
            ">

                <SummaryCard
                    title="Total Events"
                    value={stats.total_events}
                    icon={Database}
                />

                <SummaryCard
                    title="Alerts"
                    value={stats.total_alerts}
                    icon={ShieldAlert}
                    color="text-yellow-400"
                />

                <SummaryCard
                    title="Critical"
                    value={critical}
                    icon={AlertTriangle}
                    color="text-red-500"
                />

                <SummaryCard
                    title="ML Threats"
                    value={stats.total_alerts}
                    icon={Brain}
                    color="text-purple-400"
                />

            </div>

            <div className="grid gap-6 xl:grid-cols-2">

                <RiskChart
                    risk={stats.risk_levels}
                />

                <EventChart
                    events={stats.event_types}
                />

            </div>

        </div>

    )

}