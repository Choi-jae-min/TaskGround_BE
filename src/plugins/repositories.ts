import fp from "fastify-plugin";
import {FastifyPluginAsync} from "fastify";
import {ProjectRepository} from "../domain/project/repository.js";
import {ProjectService} from "../domain/project/service.js";

declare module "fastify" {
    interface FastifyInstance {
        repositories: {
            project: ProjectRepository;
        };
        services: {
            project: ProjectService;
        };
    }
}

const repositoriesPlugin: FastifyPluginAsync = async (fastify) => {
    const projectRepo = new ProjectRepository(fastify.db);

    const projectService = new ProjectService(projectRepo);
    fastify.decorate("repositories", {
        project: projectRepo,
    });
    fastify.decorate("services", {
        project: projectService,
    });
};

export default fp(repositoriesPlugin, {
    name: "repositories",
    dependencies: ["database"],
});
