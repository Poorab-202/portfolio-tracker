"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api.js";

export default function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/positions")
      .then((res) => {
        setPositions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading positions...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Open Positions</h1>

      {positions.length === 0 && (
        <p>No open positions.</p>
      )}

      {positions.map((p) => (
        <div key={p.symbol} className="border p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2">{p.symbol}</h2>

          <p className="mb-1">Open Qty: {p.open_qty}</p>
          <p className="mb-3">Avg Cost: {Number(p.avg_cost).toFixed(2)}</p>

          <h3 className="font-medium">Lots:</h3>
          <ul className="ml-4 list-disc">
            {p.lots.map((lot) => (
              <li key={lot.id}>
                {lot.qty} units @ {Number(lot.cost).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
