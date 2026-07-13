export default function EventsTable({ events }) {

    return (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-6">
                📄 Latest Events
            </h2>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-slate-700 text-slate-400">

                            <th className="text-left py-3">Event</th>
                            <th>User</th>
                            <th>IP</th>
                            <th>Port</th>
                            <th>Risk</th>
                            <th>ML</th>

                        </tr>

                    </thead>

                    <tbody>

                        {events?.map((event) => (

                            <tr
                                key={event.id}
                                className="border-b border-slate-800 hover:bg-slate-800 transition"
                            >

                                <td className="py-4">
                                    {event.event_type}
                                </td>

                                <td>{event.username || "-"}</td>

                                <td>{event.source_ip || "-"}</td>

                                <td>{event.port || "-"}</td>

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

                                <td>

                                    {event.ml_prediction?.prediction === 1
                                        ? "🚨 Threat"
                                        : "✅ Safe"}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}