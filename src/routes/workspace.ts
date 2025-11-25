import { FastifyPluginAsync } from "fastify";
import { products } from "../db/schema/products.js";
import { desc } from "drizzle-orm";

const taskRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/workspace", async (request, reply) => {
        try {
            const rows = await fastify.db
                .select({
                    id: products.id,
                    createdAt: products.createdAt,
                })
                .from(products)
                .orderBy(desc(products.createdAt));

            return {
                ok: true,
                count: rows.length,
                workspaces: rows,
            };
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });
};

export default taskRoutes;
