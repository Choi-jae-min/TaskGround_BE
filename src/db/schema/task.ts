import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {board} from "./board";

export const task = pgTable("task", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    assignee: text("assignee").notNull(),
    tag: text("tag"),
    boardId: uuid("board_id")
        .notNull()
        .references(() => board.id, { onDelete: "cascade" }),
    dueDate: timestamp("due_date",{withTimezone : true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const taskRelations = relations(
    task , ({one}) => ({
        project: one(board, {
            fields: [task.boardId],
            references: [board.id],
        }),
    })
)