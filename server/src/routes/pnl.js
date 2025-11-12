import express from "express";
import pool from "../db.js";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const total = await pool.query(
            `SELECT COALESCE(SUM(pnl),0) AS total_realized_pnl,
            COALESCE(SUM(qty),0) AS total_realized_qty 
            FROM realized_pnl`
        );
        const bySymbol = await pool.query(
            `SELECT symbol, SUM(pnl) as realized_pnl, SUM(qty) as realized_qty
             FROM realized_pnl GROUP BY symbol ORDER BY symbol`
        );
        const rows = await pool.query(
            `SELECT * FROM realized_pnl ORDER BY ts DESC`
        );
        
        res.json({
            total_realized_pnl: Number(total.rows[0].total_realized_pnl),
            total_realized_qty: Number(total.rows[0].total_realized_qty),
            by_symbol: bySymbol.rows,
            rows: rows.rows
        })
    } catch (error) {
        console.error("Error fetching PnL:", error);
        res.status(500).json({ error: error.message });
    }
})


export default router;