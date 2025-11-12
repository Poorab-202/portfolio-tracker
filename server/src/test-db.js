import pkg from "pg"
import dotenv from "dotenv"
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const test = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Connected! Database time:", res.rows[0]);
    } catch (err) {
        console.error("Database connection error:", err.message);
    } finally {
        await pool.end();
    }
}

test();
