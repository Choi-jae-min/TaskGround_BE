import { FastifyPluginAsync } from "fastify";
import { desc, eq } from "drizzle-orm";
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

            const rows = await fastify.db
                .select()
                .from(workspaces)
                .limit(Number(limit))
                .offset(Number(offset))
                .orderBy(desc(workspaces.createdAt));

            const totalCount = await fastify.db
                .select({ count: workspaces.id })
                .from(workspaces);

            return {
                ok: true,
                pagination: {
                    limit,
                    offset,
                    total: totalCount.length,
                },
                items: rows,
            };
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

            const [row] = await fastify.db
                .select()
                .from(workspaces)
                .where(eq(workspaces.id, id))
                .limit(1);


            if (!row) {
                return reply.status(404).send({
                    ok: false,
                    error: "Workspace not found",
                });
            }

            return { ok: true, workspace: row };
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
    fastify.post("/workspace", async (request, reply) => {
        try {
            const body = request.body as { name: string; description?: string };

            const created = await fastify.db.insert(workspaces).values({
                name: body.name,
                description: body.description ?? null,
                ownerId: "TODO-USER-ID", // 실제 유저 ID를 JWT or session에서 가져오면 됨
            }).returning();

            return reply.status(201).send({
                ok: true,
                workspace: created[0],
            });
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
