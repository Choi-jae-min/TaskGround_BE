import { schema } from "../db/schema/index.js";
import {NodePgDatabase} from "drizzle-orm/node-postgres";

export class ProjectService {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async getProjectList(limit: number, offset: number) {
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

    // async getProjectById(id: string) {
    //     return await this.db.query.projects.findFirst({
    //         where: (projects, { eq }) => eq(projects.id, id),
    //     });
    // }
    //
    // async createProject(data: InsertProject) {
    //     return await this.db.insert(schema.projects).values(data).returning();
    // }
}