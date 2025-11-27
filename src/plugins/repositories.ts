import fp from "fastify-plugin";
import {FastifyPluginAsync} from "fastify";
import {createDomains} from "../domain/registry.js";

declare module "fastify" {
    interface FastifyInstance {
        repositories: ReturnType<typeof createDomains>["repositories"];
        services: ReturnType<typeof createDomains>["services"];
    }
}

const repositoriesPlugin: FastifyPluginAsync = async (fastify) => {
    const { repositories, services } = createDomains(fastify.db);

    fastify.decorate("repositories", repositories);
    fastify.decorate("services", services);

};

export default fp(repositoriesPlugin, {
    name: "repositories",
    dependencies: ["database"],
});
