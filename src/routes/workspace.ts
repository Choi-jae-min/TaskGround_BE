import { FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";
import { workspaces } from "../db/schema/workSpace.js";

const workspaceRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get("/workspace/me",{
        schema : {
            tags : ['workspace'],
        },
        preHandler : [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user!.id;
            return await fastify.services.workspace.getWorKSpaceListByMemberId(userId)
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });


    fastify.get("/workspace/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            return await fastify.services.workspace.getWorkspaceById(id)
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspace by id");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    fastify.post("/workspace",{
        schema : {
            tags : ['workspace'],
            body : {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                },
            }
        },
        preHandler : [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user!.id;
            const body = request.body as { name: string; description?: string };
            return await fastify.services.workspace.createWorkspace({...body , ownerId : userId})
        } catch (err) {
            request.log.error({ err }, "Failed to create workspace");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    fastify.patch("/workspace/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const body = request.body as { name?: string; description?: string };

            const updated = await fastify.db
                .update(workspaces)
                .set({
                    name: body.name,
                    description: body.description,
                    updatedAt: new Date(),
                })
                .where(eq(workspaces.id, id))
                .returning();

            if (!updated.length) {
                return reply.status(404).send({
                    ok: false,
                    error: "Workspace not found",
                });
            }

            return { ok: true, workspace: updated[0] };
        } catch (err) {
            request.log.error({ err }, "Failed to update workspace");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    fastify.delete("/workspace/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            const deleted = await fastify.db
                .delete(workspaces)
                .where(eq(workspaces.id, id))
                .returning();

            if (!deleted.length) {
                return reply.status(404).send({
                    ok: false,
                    error: "Workspace not found",
                });
            }

            return { ok: true };
        } catch (err) {
            request.log.error({ err }, "Failed to delete workspace");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });
};

export default workspaceRoutes;
