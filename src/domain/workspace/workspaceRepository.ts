import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {eq} from "drizzle-orm";
import {workspaces} from "../../db/schema/workSpace.js";

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
        const workspace = await this.db.query.workspaces.findFirst({
            where: eq(workspaces.id, id),
            with: {
                members: true,
                projects: true,
            },
        });

        if(!workspace){
            return {}
        }

        return workspace
    }

    async createWorkspace(data: CreateWorkspaceInput) {
        const [workspace] = await this.db
            .insert(schema.workspaces)
            .values(data)
            .returning();

        return workspace;
    }
}