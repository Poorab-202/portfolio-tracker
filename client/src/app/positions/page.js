"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";

export default function PositionsPage() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/positions")
            .then((res) => {
                setPositions(res.data);
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
                <p>Loading positions...</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-black text-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
                    Open Positions
                </h1>

                {positions.length === 0 && (
                    <p className="text-center text-gray-400">No open positions.</p>
                )}

                <div className="space-y-6">
                    {positions.map((p) => (
                        <div
                            key={p.symbol}
                            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-white tracking-wide">
                                    {p.symbol}
                                </h2>

                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 font-semibold rounded-lg">
                                        Qty: {p.open_qty}
                                    </span>
                                    <span className="px-3 py-1 bg-green-600/20 text-green-300 font-semibold rounded-lg">
                                        Avg: {Number(p.avg_cost).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                           



                           
                            <div className="mt-3">
                                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                                    Lots Breakdown
                                </h3>

                                <div className="space-y-2">
                                    {p.lots.map((lot) => (
                                        <div
                                            key={lot.id}
                                            className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10"
                                        >
                                            <span className="text-gray-300">
                                                {lot.qty} units
                                            </span>
                                            <span className="text-gray-200 font-semibold">
                                                @ {Number(lot.cost).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
