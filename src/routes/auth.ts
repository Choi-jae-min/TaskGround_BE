import {FastifyPluginAsync} from "fastify";

const authRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/user" ,{
        schema : {
            tags : ['auth']
        },
        preHandler : [fastify.authenticate]
    }, async (request ,reply) => {
        const userId = request.user!.id;
        const userData = await fastify.services.auth.getUserData(userId);
        const workSpaceList =  await fastify.services.member.getWorkspaceIdsByUserId(userId);
        const projectCount = await fastify.services.project.getProjectCountsByWorkspace(workSpaceList);
        return reply.send({
            projectCount,
            userData,
            workSpaceList,
            ok: true,
        });
    })

    fastify.post("/login",{
        schema : {
            tags : ['auth']
        }
    }, async (request, reply) => {
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

    fastify.post("/logOut",{
        schema : {
            tags :['auth']
        }
    }, async (request, reply) => {
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


    fastify.post("/signUp",{
        schema : {
            tags : ['auth']
        }
    }, async (request, reply) => {
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

    fastify.post("/signOut", {
        schema : {
            tags : ['auth']
        }
    },async (request, reply) => {
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