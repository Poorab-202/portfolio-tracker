"use client";
import { useState } from "react";
import { api } from "@/../lib/api.js";

export default function TradesPage() {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const submitTrade = async (e) => {
    e.preventDefault();
    try {
      const body = {
        symbol: symbol.toUpperCase(),
        qty: Number(qty),
        price: Number(price),
      };

      await api.post("/trades", body);

      setMessage("Trade submitted successfully!");
      setSymbol("");
      setQty("");
      setPrice("");
    } catch (error) {
      console.error(error);
      setMessage("Error submitting trade");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Trade</h1>

      <form onSubmit={submitTrade} className="space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Symbol (AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Quantity (positive = buy, negative = sell)"
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
