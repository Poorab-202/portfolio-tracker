import { createConsumer } from "./kafka.js";
import pool from "./db.js";
import dotenv from "dotenv"
dotenv.config();

const topic = "trades";
const groupId = "lotwise-worker-group";

const run = async () => {
    const consumer = createConsumer(groupId);
    await consumer.connect();
    console.log("Kafka consumer connected");
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            const trade = JSON.parse(value);
            console.log("Received trade:", trade.symbol, trade.qty, trade.price);

            const client = await pool.connect();
            try {
                await client.query("BEGIN");


                await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [trade.symbol]);


                const check = await client.query(`SELECT processed FROM trades WHERE id=$1 FOR UPDATE`, [trade.id]);
                if (check.rowCount === 0) {
                    console.log("Trade not found in DB, skipping:", trade.id);
                    await client.query("ROLLBACK");
                    return;
                }
                if (check.rows[0].processed) {
                    console.log("Trade already processed, skipping:", trade.id);
                    await client.query("ROLLBACK");
                    return;
                }

                if (trade.qty > 0) {

                    await client.query(
                        `INSERT INTO lots(symbol, qty, original_qty, cost, trade_id)
             VALUES ($1, $2, $3, $4, $5)`,
                        [trade.symbol, trade.qty, trade.qty, trade.price, trade.id]
                    );
                } else {

                    let remainingToSell = Math.abs(trade.qty);
                    const res = await client.query(
                        `SELECT id, qty, cost FROM lots
             WHERE symbol=$1 AND qty>0
             ORDER BY created_at ASC FOR UPDATE`,
                        [trade.symbol]
                    );

                    for (const lot of res.rows) {
                        if (remainingToSell <= 0) break;

                        const lotQty = Number(lot.qty);
                        const sellQty = Math.min(remainingToSell, lotQty);
                        const pnl = (Number(trade.price) - Number(lot.cost)) * sellQty;

                        await client.query(
                            `INSERT INTO realized_pnl(symbol, qty, buy_lot_id, sell_trade_id, buy_cost, sell_price, pnl)
               VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                            [trade.symbol, sellQty, lot.id, trade.id, lot.cost, trade.price, pnl]
                        );

                        if (sellQty === lotQty) {
                            await client.query(`UPDATE lots SET qty=0, closed_at=now() WHERE id=$1`, [lot.id]);
                        } else {
                            await client.query(`UPDATE lots SET qty=qty-$1 WHERE id=$2`, [sellQty, lot.id]);
                        }

                        remainingToSell -= sellQty;
                    }

                    if (remainingToSell > 0) {
                        throw new Error(`Sell exceeds available open quantity for ${trade.symbol}`);
                    }
                }

                await client.query(`UPDATE trades SET processed=true WHERE id=$1`, [trade.id]);
                await client.query("COMMIT");
                console.log("Processed trade:", trade.symbol, trade.qty);
            } catch (err) {
                console.error("Worker error for", trade.symbol, ":", err.message);
                await client.query("ROLLBACK");
            } finally {
                client.release();
            }
        },
    });
};

run().catch((err) => {
    console.error("Worker startup error:", err.message);
    process.exit(1);
});
