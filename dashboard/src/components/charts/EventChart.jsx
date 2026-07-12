import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

export default function EventChart({ events }) {

    const data = Object.entries(events).map(([name, value]) => ({
        name: name.replace("_", " "),
        value
    }));

    return (
        <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            h-96
        ">

            <h2 className="text-xl font-semibold mb-6">
                Event Types
            </h2>

            <ResponsiveContainer width="100%" height="90%">

                <BarChart data={data}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                    />

                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                    />

                    <YAxis stroke="#94a3b8" />

                    <Tooltip />

                    <Bar
                        dataKey="value"
                        fill="#06b6d4"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}