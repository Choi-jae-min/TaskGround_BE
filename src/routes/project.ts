import { FastifyPluginAsync } from "fastify";

const projectRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/project/list",{
        schema : {
            tags : ['project'],
        }
    }, async (request, reply) => {
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

    fastify.get("/project/:id",{
        schema : {
            tags : ['project'],
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            return await fastify.services.project.getProjectById(id);

        } catch (err) {
            request.log.error({ err }, "Failed to fetch project");
            return reply.status(500).send({
                ok: false,
                error: "Internal Server Error"
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
                    description: { type: "string" },
                    workspaceId: { type: "string"},
                },
            }
        }
    } ,async (request ,reply) => {
        try {
            const body = request.body as { name : string , description :string ,workspaceId : string}

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
