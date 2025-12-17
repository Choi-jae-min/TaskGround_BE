import {integer, pgTable, text, timestamp, uniqueIndex, uuid} from "drizzle-orm/pg-core";
import {task} from "./task.js";
import {relations} from "drizzle-orm";
export const block = pgTable(
    "block",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        orderNumber: integer("order_number").notNull(),
        content: text("content"),
        taskId: uuid("task_id")
            .notNull()
            .references(() => task.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        uniqueOrder: uniqueIndex("block_task_id_order_number_unique").on(
            table.taskId,
            table.orderNumber
        ),
    })
);

export const blockRelations = relations(
    block , ({one}) => ({
        task : one(task, {
            fields : [block.taskId],
            references : [task.id]
        })
    })
)