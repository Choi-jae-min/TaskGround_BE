import { FastifyPluginAsync } from "fastify";

const projectRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
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

    fastify.post("/project",{
        schema : {
            tags : ['project'],
            body : {
                type :"object",
                required: ["name", "workspaceId"],
                properties: {
                    name: { type: "string" },
                    workspaceId: { type: "string"},
                },
            }
        }
    } ,async (request ,reply) => {
        try {
            const body = request.body as { name : string , workspaceId : string}

            return await fastify.services.project.createProject(body)
        }catch (err){
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    })
};

export default projectRoutes;
