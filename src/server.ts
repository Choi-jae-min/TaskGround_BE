import "dotenv/config";
import Fastify from "fastify";
import app from "./app.js";

const signals = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
    process.on(signal, async () => {
        fastify.log.info(`📥 Received ${signal}, shutting down gracefully...`);
        await fastify.close();
        process.exit(0);
    });
});

const fastify = Fastify({ logger: true });

try {
    await fastify.register(app);
    await fastify.listen({ port: 3000 });
    console.log("🚀 Server running at http://localhost:3000");
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
