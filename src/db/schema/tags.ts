import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {project} from "./project";

export const tag = pgTable("tag", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => project.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const tagRelations = relations(
    tag , ({one}) => ({
        project: one(project, {
            fields: [tag.projectId],
            references: [project.id],
        }),
    })
)

