import express from "express"
import pool from "../db.js"
import { producer } from "../kafka.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {

        const { symbol, qty, price, ts } = req.body;
        if (!symbol || !qty || !price) {
            return res.status(400).json({
                message: "symbol, qty, and price are required!",
                success: false
            });
        }

        const result = await pool.query(
            `INSERT INTO trades (symbol, qty, price, ts) values ($1,$2,$3,$4) RETURNING *`,
            [symbol.toUpperCase(), qty, price, ts || new Date()]
        );

        const insertedTrade = result.rows[0];
        await producer.send({
            topic: "trades",
            messages: [
                {
                    key: insertedTrade.symbol,
                    value: JSON.stringify(insertedTrade)
                }
            ]
        });
        console.log("Published to Kafka:", insertedTrade);
        res.status(201).json(insertedTrade);

    } catch (error) {
        console.error("Error inserting trade:", error);
        res.status(500).json({ error: error.message });
    }
})


router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM trades ORDER BY ts DESC"
        );
        res.status(200).json(result.rows);

    } catch (error) {
        console.log("Error sending trades: ", error);
        res.status(500).json({ error: error.message });
    }

})

export default router;