import { FastifyPluginAsync } from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import databasePlugin from "./plugins/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: FastifyPluginAsync = async (fastify, opts) => {

    await fastify.register(databasePlugin);

    fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
    });

    fastify.log.info("✅ app.ts setup finished");
};

export default app;
