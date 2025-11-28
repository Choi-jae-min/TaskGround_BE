import {
    pgTable,
    uuid,
    text,
    timestamp,
    pgEnum,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {project} from "./project.js";
import {users} from "./auth.js";
// import { users } from "./users"; // 유저 테이블 있다고 가정

export const workspaceMemberStatusEnum = pgEnum("workspace_member_status", [
    "INVITED",
    "ACTIVE",
    "LEFT",
]);

export const workspaceRoleEnum = pgEnum("workspace_role", [
    "OWNER",
    "ADMIN",
    "MEMBER",
]);

export const workspaces = pgTable("workspaces", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    ownerId: uuid("owner_id").notNull(),   // users.id 와 FK 걸 예정
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const workspaceMembers = pgTable(
    "workspace_members",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        workspaceId: uuid("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        userId: uuid("user_id")
            .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        status: workspaceMemberStatusEnum("status")
            .notNull()
            .default("INVITED"),
        role: workspaceRoleEnum("role")
            .notNull()
            .default("MEMBER"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => {
        return {
            // 같은 workspace 에 같은 user 두 번 못 들어가게
            uniqWorkspaceUser: uniqueIndex("workspace_user_unique").on(
                table.workspaceId,
                table.userId,
            ),
        };
    },
);

export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
    members: many(workspaceMembers),
    projects : many(project),
    owner: one(users, {
      fields: [workspaces.ownerId],
      references: [users.id],
    }),
}));

export const workspaceMembersRelations = relations(
    workspaceMembers,
    ({ one }) => ({
        workspace: one(workspaces, {
            fields: [workspaceMembers.workspaceId],
            references: [workspaces.id],
        }),
        user: one(users, {
          fields: [workspaceMembers.userId],
          references: [users.id],
        }),
    }),
);

