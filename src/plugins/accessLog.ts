import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify";

declare module "fastify" {
    interface FastifyRequest {
        _rtStart?: bigint;
    }
}

export const accessLogPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request: FastifyRequest) => {
        request._rtStart = process.hrtime.bigint();
    });

    fastify.addHook("onResponse", async (request, reply) => {
        const start = request._rtStart ?? process.hrtime.bigint();
        const rtMs = Number((process.hrtime.bigint() - start) / 1_000_000n);

        // routerPath가 있으면 "/task/:id" 처럼 찍혀서 집계가 쉬움
        const route = (request as any).routerPath ?? request.url;

        request.log.info({
            type: "http",
            ts: Date.now(),
            m: request.method,
            route,
            url: request.url,
            status: reply.statusCode,
            rtMs,
            // 필요하면 아래도 추가
            // ip: request.ip,
            // ua: request.headers["user-agent"],
            // bytesIn: request.headers["content-length"],
        });
    });
};
