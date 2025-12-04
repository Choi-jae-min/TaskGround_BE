import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {project} from "../../db/schema/project.js";

type MemberInsert = typeof project.$inferInsert;

export class ProjectRepository {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async findMany(limit: number, offset: number) {
        const rows = await this.db
            .select()
            .from(schema.project)
            .limit(limit)
            .offset(offset);

        const totalCount = await this.db
            .select({ count: schema.project.id })
            .from(schema.project);

        return {
            ok: true,
            pagination: {
                limit,
                offset,
                total: totalCount.length,
            },
            items: rows,
        };
    }

    async createProject() {

    }
}