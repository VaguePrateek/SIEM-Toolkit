const severityColors = {
    Critical: "bg-red-500/20 text-red-400",
    High: "bg-orange-500/20 text-orange-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Low: "bg-green-500/20 text-green-400"
};

export default function AlertsTable({ alerts }) {

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
                🚨 Recent Alerts
            </h2>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-slate-700 text-slate-400">

                            <th className="text-left py-3">Time</th>
                            <th className="text-left">Rule</th>
                            <th className="text-left">Severity</th>
                            <th className="text-left">Source IP</th>
                            <th className="text-left">Risk</th>

                        </tr>

                    </thead>

                    <tbody>

                        {alerts?.map((alert, index) => (

                            <tr
                                key={index}
                                className="border-b border-slate-800 hover:bg-slate-800 transition"
                            >

                                <td className="py-4">
                                    {new Date(alert.timestamp).toLocaleString()}
                                </td>

                                <td>{alert.rule}</td>

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            severityColors[alert.severity] || ""
                                        }`}
                                    >
                                        {alert.severity}
                                    </span>

                                </td>

                                <td>{alert.source_ip || "-"}</td>

                                <td>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            alert.risk?.level === "Critical"
                                                ? "bg-red-500/20 text-red-400"
                                                : alert.risk?.level === "High"
                                                ? "bg-orange-500/20 text-orange-400"
                                                : alert.risk?.level === "Medium"
                                                ? "bg-yellow-500/20 text-yellow-400"
                                                : "bg-green-500/20 text-green-400"
                                        }`}>
                                                {alert.risk?.level ?? "Unknown"}
                                    </span>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );

}