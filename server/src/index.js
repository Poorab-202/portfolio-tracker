import express from "express"
import dotenv from "dotenv"
import pool from "./db.js";
import tradeRoutes from "./routes/trades.js"


dotenv.config();



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("hello!")
})

app.get("/db-test",
    async (req, res) => {
        try {
            const result = await pool.query("SELECT NOW()");
            res.json({ success: true, server_time: result.rows[0].now });
        } catch (err) {
            console.error("DB error:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
)

app.use("/trades/", tradeRoutes);

app.listen(PORT, () => {
    console.log("server started on port -", PORT);
})