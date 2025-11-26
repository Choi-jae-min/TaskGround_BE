import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {project} from "./project.js";

export const board = pgTable("board", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => project.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const projectRelations = relations(
    board , ({one}) => ({
        project: one(project, {
            fields: [board.projectId],
            references: [project.id],
        }),
    })
)

