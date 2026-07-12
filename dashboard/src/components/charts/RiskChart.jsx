import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#22c55e",
    "#06b6d4",
    "#eab308",
    "#f97316",
    "#ef4444"
];

export default function RiskChart({risk}){

    const data=Object.entries(risk).map(
        ([name,value])=>({
            name,
            value
        })
    );

    return(

        <div className="
            bg-slate-900
            rounded-2xl
            border
            border-slate-800
            p-6
            h-96
        ">

            <h2 className="text-xl font-semibold mb-6">

                Risk Distribution

            </h2>

            <ResponsiveContainer>

                <PieChart>

                    <Pie

                        data={data}

                        dataKey="value"

                        nameKey="name"

                        outerRadius={120}

                    >

                        {
                            data.map((entry,index)=>

                                <Cell

                                    key={index}

                                    fill={
                                        COLORS[index%COLORS.length]
                                    }

                                />

                            )
                        }

                    </Pie>

                    <Tooltip/>

                </PieChart>

            </ResponsiveContainer>

        </div>

    )

}