import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";

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

    // async findById(id: string) {
    //     return await this.db.query.projects.findFirst({
    //         where: (projects, { eq }) => eq(projects.id, id),
    //     });
    // }
    //
    // async create(data: InsertProject) {
    //     return await this.db.insert(schema.projects).values(data).returning();
    // }
    //
    // async update(id: string, data: Partial<InsertProject>) {
    //     return await this.db
    //         .update(schema.projects)
    //         .set(data)
    //         .where(eq(schema.projects.id, id))
    //         .returning();
    // }
    //
    // async delete(id: string) {
    //     return await this.db
    //         .delete(schema.projects)
    //         .where(eq(schema.projects.id, id));
    // }
}