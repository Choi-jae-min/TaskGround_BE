import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {eq, or} from "drizzle-orm";
import {workspaceMembers, workspaces} from "../../db/schema/workSpace.js";

type WorkspaceInsert = typeof workspaces.$inferInsert;

export type CreateWorkspaceInput = Omit<WorkspaceInsert, "id" | "createdAt" | "updatedAt">;

export class WorkspaceRepository {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async findWorkSpacePagination(limit: number, offset: number) {
        const rows = await this.db
            .select()
            .from(schema.workspaces)
            .limit(limit)
            .offset(offset);

        const totalCount = await this.db
            .select({ count: schema.workspaces.id })
            .from(schema.workspaces);

        return {
            pagination: {
                limit,
                offset,
                total: totalCount.length,
            },
            items: rows,
        };
    }

    async findWorkspaceById(id:string) {
        return this.db.query.workspaces.findFirst({
            where: eq(workspaces.id, id),
            with: {
                members: true,
                projects: true,
            },
        });
    }

    async findWorkspacesByMemberId(memberId: string) {
        return this.db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                description: workspaces.description,
                ownerId: workspaces.ownerId,
                role: workspaceMembers.role,
                status: workspaceMembers.status,
                createdAt: workspaces.createdAt,
                updatedAt: workspaces.updatedAt,
            })
            .from(workspaceMembers)
            .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
            .where(
                or(
                    eq(workspaceMembers.userId, memberId),
                    eq(workspaces.ownerId, memberId)
                )
            );
    }

    async createWorkspace(data: CreateWorkspaceInput) {
        const [workspace] = await this.db
            .insert(schema.workspaces)
            .values(data)
            .returning();

        return workspace;
    }
}