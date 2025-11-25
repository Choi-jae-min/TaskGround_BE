// src/app.ts
import { FastifyPluginAsync } from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import supabasePlugin from "./plugins/supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: FastifyPluginAsync = async (fastify, opts) => {
    fastify.log.info("🔌 Registering supabasePlugin");
    fastify.register(supabasePlugin);

    // fastify.log.info("🔌 Registering dbPlugin");
    // fastify.register(dbPlugin);

    fastify.log.info("📦 Registering routes (AutoLoad)");
    fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
    });

    fastify.log.info("✅ app.ts setup finished");
};

export default app;
