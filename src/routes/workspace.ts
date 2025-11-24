import { FastifyPluginAsync } from "fastify";

const taskRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/workspace", async (request, reply) => {
        return { hello: "world" };
    });

    // fastify.post("/tasks" , async (request,reply) => {
    //
    // })
};

export default taskRoutes;
