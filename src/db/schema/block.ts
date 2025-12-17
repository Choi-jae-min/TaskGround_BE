import {integer, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {task} from "./task.js";
import {relations} from "drizzle-orm";

export const block = pgTable(
    "block",
    {
        id : uuid("block").defaultRandom().primaryKey(),
        orderNumber : integer("order_number").notNull().primaryKey(),
        content: text('content'),
        taskId : uuid('task_id')
            .notNull()
            .references(() => task.id,{ onDelete : "cascade" }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
    }
)

export const blockRelations = relations(
    block , ({one}) => ({
        task : one(task, {
            fields : [block.taskId],
            references : [task.id]
        })
    })
)