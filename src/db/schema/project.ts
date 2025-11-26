import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {workspaces} from "./workSpace";
import {board} from "./board";

export const project = pgTable("project", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const projectRelations = relations(
    project , ({many,one}) => ({
        workspace: one(workspaces, {
            fields: [project.workspaceId],
            references: [workspaces.id],
        }),
        board : many(board)
    })
)

