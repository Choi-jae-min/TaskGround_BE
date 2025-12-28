import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {task} from "../../db/schema/task.js";
import {and, eq, sql} from "drizzle-orm";

type TaskInsert = typeof task.$inferInsert;

export type CreateTaskInput = Omit<TaskInsert, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput =
    Partial<Omit<TaskInsert, "id" | "createdAt" | "updatedAt" | "version">> & {
    version: number;
};


export class TaskRepository{
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async createTask(body : CreateTaskInput){
        const [task] = await this.db
            .insert(schema.task)
            .values(body)
            .returning();

        return task
    }

    async updateTask(taskId :string ,body : UpdateTaskInput){
        const new_version = body.version + 1
        const [updated] = await this.db
            .update(task)
            .set({
                ...body,
                dueDate : body.dueDate && new Date(body.dueDate),
                updatedAt: new Date(),
                version: new_version,
            })
            .where(and(eq(task.id, taskId), eq(task.version, body.version)))
            .returning();

        console.log('updated' , updated)
        if (!updated) {
            // 충돌: 누군가 먼저 업데이트해서 version이 바뀜
            const current = await this.db.query.task.findFirst({
                where: eq(task.id, taskId),
                columns: { id: true, version: true, updatedAt: true },
            });

            // 404 vs 409 구분
            if (!current) {
                return { ok: false, code: "NOT_FOUND" as const };
            }
            return { ok: false, code: "CONFLICT" as const, current };
        }

        return { ok: true, task: updated };
    }
}