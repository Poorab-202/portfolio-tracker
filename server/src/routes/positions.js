import express from "express"
import pool from "../db.js"

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const agg = pool.query("SELECT * FROM  positions ORDER BY symbol");
        const lots = pool.query(`SELECT symbol, qty, original_qty, cost, created_at, closed_at 
            FROM lots WHERE qty>0 ORDER BY symbol, created_at`);

        const map = {};
        for (const row of agg.rows) {
            map[row.symbol] = {
                symbol: row.symbol,
                open_qty: Number(row.open_qty),
                avg_cost: Number(row.avg_cost),
                lots: []
            }
        };

        for (const l of lots) {
            const s = l.symbol;
            if (!map[s])
                map[s] = { symbol: s, open_qty: Number(l.qty), avg_cost: Number(l.cost), lots: [] };
            map[s].lots.push(l);
        }

        res.json(Object.values(map));

    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(400).json({
            success: false,
            error: error.message
        });

    }

})


export default router;