import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import {ProjectService} from "../services/projectService.js";

declare module "fastify" {
    interface FastifyInstance {
        projectService: ProjectService;
    }
}

const servicesPlugin: FastifyPluginAsync = async (fastify) => {
    const projectService = new ProjectService(fastify.db);

    fastify.decorate("projectService", projectService);

    fastify.log.info("✅ Services registered");
};

export default fp(servicesPlugin, {
    name: "services",
    dependencies: ["database"], // DB 플러그인 먼저 로드
});