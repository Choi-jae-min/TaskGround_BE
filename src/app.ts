import { FastifyPluginAsync } from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: FastifyPluginAsync = async (fastify, opts) => {
    fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
    });
};

export default app;
