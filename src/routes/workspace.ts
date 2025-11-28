import { FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";
import { workspaces } from "../db/schema/workSpace.js";

const workspaceRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // ---------------------------------------------------------
    // GET /workspace
    //    → 전체 목록 + 페이지네이션(limit, offset)
    // ---------------------------------------------------------
    fastify.get("/workspace", async (request, reply) => {
        try {
            const { limit = 10, offset = 0 } = request.query as {
                limit?: number;
                offset?: number;
            };

            return await fastify.services.workspace.getWorkspaceByPagination(limit , offset)
        } catch (err) {
            request.log.error({ err }, "Failed to fetch workspaces");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    // ---------------------------------------------------------
    // GET /workspace/:id
    //    → 단일 조회
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // POST /workspace
    //    → 생성
    // ---------------------------------------------------------
    fastify.post("/workspace",{
        schema : {
            tags : ['workspace'],
            body : {
                type: "object",
                required: ["name", "ownerId"],
                properties: {
                    name: { type: "string" },
                    ownerId: { type: "string"},
                    description: { type: "string" },
                },
            }
        },
    }, async (request, reply) => {
        try {
            const body = request.body as { name: string; ownerId:string; description?: string };
            return await fastify.services.workspace.createWorkspace(body)
        } catch (err) {
            request.log.error({ err }, "Failed to create workspace");
            return reply.status(500).send({
                ok: false,
                error: (err as Error).message,
            });
        }
    });

    // ---------------------------------------------------------
    // PATCH /workspace/:id
    //    → 수정
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // DELETE /workspace/:id
    //    → 삭제
    // ---------------------------------------------------------
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
