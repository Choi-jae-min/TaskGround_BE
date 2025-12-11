import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {task} from "../../db/schema/task.js";

type TaskInsert = typeof task.$inferInsert;

export type CreateTaskInput = Omit<TaskInsert, "id" | "createdAt" | "updatedAt">;

export class TaskRepository{
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async createTask(body : CreateTaskInput){
        console.log('body' , body)

        const [task] = await this.db
            .insert(schema.task)
            .values(body)
            .returning();

        return task
    }
}