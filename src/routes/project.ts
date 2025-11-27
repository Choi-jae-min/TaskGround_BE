import { FastifyPluginAsync } from "fastify";

const workspaceRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // ---------------------------------------------------------
    // GET /project
    //    → 전체 목록 + 페이지네이션(limit, offset)
    // ---------------------------------------------------------
    fastify.get("/project", async (request, reply) => {
        try {
            const { limit = 10, offset = 0 } = request.query as {
                limit?: number;
                offset?: number;
            };
            return await fastify.services.project.getProjectList(limit,offset)

        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

};

export default workspaceRoutes;
