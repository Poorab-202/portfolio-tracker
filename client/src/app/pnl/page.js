"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

export default function PnLPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/pnl")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading)
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <p>Loading PnL...</p>
            </div>
        );

    if (!data)
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <p>No PnL data found.</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-black text-gray-200 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10 text-center text-white">
                    Realized P&amp;L
                </h1>


                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-xl mb-12">
                    <p className="text-2xl font-semibold text-gray-300">
                        Total Realized PnL:{" "}
                        <span
                            className={
                                data.total_realized_pnl >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                            }
                        >
                            {data.total_realized_pnl}
                        </span>
                    </p>

                    <p className="text-lg text-gray-400 mt-2">
                        Total Closed Quantity:{" "}
                        <span className="text-gray-200 font-semibold">
                            {data.total_realized_qty}
                        </span>
                    </p>
                </div>






                <h2 className="text-2xl font-bold text-white mb-6">By Symbol</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {data.by_symbol.map((row) => (
                        <div
                            key={row.symbol}
                            className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow-md hover:bg-white/10 hover:shadow-xl transition-all"
                        >
                            <h3 className="text-xl font-bold text-white mb-3">
                                {row.symbol}
                            </h3>

                            <p className="text-gray-400">
                                Realized PnL:{" "}
                                <span
                                    className={
                                        row.realized_pnl >= 0
                                            ? "text-green-400 font-semibold"
                                            : "text-red-400 font-semibold"
                                    }
                                >
                                    {row.realized_pnl}
                                </span>
                            </p>

                            <p className="text-gray-400 mt-1">
                                Closed Qty:{" "}
                                <span className="text-gray-200 font-semibold">
                                    {row.realized_qty}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>






                <h2 className="text-2xl font-bold text-white mb-6">Recent Closures</h2>

                <div className="space-y-4">
                    {data.rows.map((r) => (
                        <div
                            key={r.id}
                            className="bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md hover:bg-white/10 transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold text-gray-200">
                                    {r.symbol}
                                </span>

                                <span
                                    className={
                                        r.pnl >= 0
                                            ? "text-green-400 font-semibold"
                                            : "text-red-400 font-semibold"
                                    }
                                >
                                    {r.pnl}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-400 text-sm">
                                <p>
                                    <span className="text-gray-500">Closed Qty:</span> {r.qty}
                                </p>
                                <p>
                                    <span className="text-gray-500">Buy Cost:</span> {r.buy_cost}
                                </p>
                                <p>
                                    <span className="text-gray-500">Sell Price:</span>{" "}
                                    {r.sell_price}
                                </p>
                                <p>
                                    <span className="text-gray-500">Time:</span> {r.ts}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
