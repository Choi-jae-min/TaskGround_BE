import { FastifyPluginAsync } from "fastify";

const boardRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/boardList",{
        schema : {
            tags :["board"],
            querystring: {
                type: "object",
                properties: {
                    projectId: { type: "string" }
                },
                required: ["projectId"]
            },
        }
    }, async (request, reply) => {
        try {
            const { projectId } = request.query as {
                projectId: string;
            };
            if(!projectId) {
                new Error("projectId id missing")
            }

            const boardList = await fastify.services.board.getBoardListByProjectId(projectId);

            return reply.send({
                ok: true,
                data: boardList
            });
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    fastify.post("/board",{
        schema : {
            tags : ['board'],
            body : {
                type :"object",
                required: ["name", "projectId"],
                properties: {
                    name: { type: "string" },
                    projectId: { type: "string"},
                    color : {type :"string"}
                },
            }
        }
    } ,async (request ,reply) => {
        try {
            const body = request.body as { name : string , projectId : string , color?:string}
            console.log('body' ,body)
            return  await fastify.services.board.createBoard(body)
        }catch (err){
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    })
};

export default boardRoutes;
