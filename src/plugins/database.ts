import fp from "fastify-plugin";
import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { schema } from "../db/schema/index.js";
import { FastifyPluginAsync } from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        db: NodePgDatabase<typeof schema>;
        pool: Pool;
    }
}

const databasePlugin: FastifyPluginAsync = async (fastify, opts) => {
    const connectionString = process.env.SUPABASE_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("SUPABASE_CONNECTION_STRING is not set");
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
    });

    pool.on("error", (err) => {
        console.error("Unexpected PG pool error:", err);
    })

    try {
        const client = await pool.connect();
        fastify.log.info("Database connected successfully");
        client.release();
    } catch (err) {
        fastify.log.error(err, "Failed to connect to database");
        throw err;
    }

    const db = drizzle(pool, { schema, logger: true });

    fastify.decorate("db", db);
    fastify.decorate("pool", pool);

    fastify.addHook("onClose", async (instance) => {
        instance.log.info("Closing database connection...");
        await pool.end();
        instance.log.info("Database connection closed");
    });
};

export default fp(databasePlugin, {
    name: "database",
    fastify: "5.x",
});