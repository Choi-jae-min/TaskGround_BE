import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {project} from "../../db/schema/project.js";
import {eq} from "drizzle-orm";

type ProjectInsert = typeof project.$inferInsert;

export type CreateProjectInput = Omit<ProjectInsert, "id" | "createdAt" | "updatedAt">;

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

    async getWorkspaceIdByProjectId(projectId : string) {
        const projectRow = await this.db.query.project.findFirst({
            where: eq(project.id, projectId),
            columns: {
                workspaceId: true,
            },
        });

        if (!projectRow) {
            throw new Error(`projectId ${projectId} not found`);
        }

        return projectRow.workspaceId;
    }

    async getProjectById(id :string){
        const isProject = await this.db.query.project.findFirst({
            where: eq(project.id, id),
            with: {
                board: {
                    with : {
                        task : true
                    }
                }
            }
        })
        if (isProject) return isProject;
        throw new Error(`project id :${id} is not found`)
    }

    async createProject(projectData : CreateProjectInput) {
        try {
            const [project] = await this.db
                .insert(schema.project)
                .values(projectData)
                .returning();

            return project
        }catch (error : any){
            console.error('error in create member' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }
}