import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.SUPABASE_CONNECTION_STRING;

if (!connectionString) {
    throw new Error("SUPABASE_CONNECTION_STRING is not set");
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

process.on("beforeExit", async () => {
    await pool.end();
});
