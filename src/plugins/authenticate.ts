import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            id: string;
            email?: string;
        };
    }

    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: any) => Promise<void>;
    }
}

const authenticatePlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate(
        "authenticate",
        async (request, reply) => {
            try {
                const accessToken = request.cookies.access_token;
                if (!accessToken) {
                    return reply.status(401).send({ ok: false, error: "토큰이 없습니다." });
                }

                const payload = jwt.verify(
                    accessToken,
                    process.env.JWT_ACCESS_SECRET as string
                ) as { sub: string; email?: string };

                request.user = {
                    id: payload.sub,
                    email: payload.email,
                };
            } catch (err) {
                request.log.error({ err }, "JWT 검증 실패");
                return reply.status(401).send({ ok: false, error: "인증 실패" });
            }
        }
    );
};

export default fp(authenticatePlugin);
