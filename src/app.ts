import { FastifyPluginAsync } from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import cors from "@fastify/cors";
import { dirname, join } from "path";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import databasePlugin from "./plugins/database.js";
import authenticatePlugin from "./plugins/authenticate.js";
import repositoriesPlugin from "./plugins/repositories.js";
import {swaggerOptions, swaggerUiOptions} from "./lib/swagger.js";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: FastifyPluginAsync = async (fastify) => {
    await fastify.register(cors, {
        origin: true,
        // origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // 이런 식으로 제한도 가능
        credentials: true,
    });
    await fastify.register(fastifySwagger, swaggerOptions)
    await fastify.register(fastifySwaggerUi, swaggerUiOptions)
    await fastify.register(databasePlugin);
    await fastify.register(repositoriesPlugin);
    await fastify.register(authenticatePlugin);
    fastify.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET!,
    } as FastifyCookieOptions);

    fastify.register((app, options, done) => {
        app.get("/", {
            schema: {
                tags: ["Default"],
                response: {
                    200: {
                        type: "object",
                        properties: {
                            anything: { type: "string" },
                        },
                    },
                },
            },
            handler: (req, res) => {
                res.send({ anything: "meaningfull" });
            },
        });
        done();
    });

    fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
    });

    fastify.log.info("✅ app.ts setup finished");
};

export default app;
