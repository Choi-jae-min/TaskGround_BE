import {FastifyPluginAsync} from "fastify";

const authRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post("/login", async (request, reply) => {
        try {
            const { email, password } = request.body as {
                email: string;
                password: string;
            };

            const {accessToken , refreshToken} = await fastify.services.auth.signIn(email,password);

            reply
                .setCookie("access_token", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 15, // 15분
                })
                .setCookie("refresh_token", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7, // 7일
                });

            return reply.send({
                message: "로그인 성공",
                ok: true,
            });
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    fastify.post("/logOut", async (request, reply) => {
        try {
            return {ok : false}
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });


    fastify.post("/signUp", async (request, reply) => {
        try {
            const { email, password,name } = request.body as {
                email: string;
                password: string;
                name : string
            };
            const user = await fastify.services.auth.signUp(email,password,name)
            return reply.status(200).send(user)

        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    fastify.post("/signOut", async (request, reply) => {
        try {

            //로그인 로직
            return {ok : true}
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });
}

export default authRoutes;