import {
    pgTable,
    text,
    uuid,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {workspaceMembers} from "./workSpace";

export const users = pgTable(
    "users",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull(),
        // 로컬 로그인용 비밀번호 해시 (OAuth-only 유저는 null)
        passwordHash: text("password_hash"),
        avatarUrl: text("avatar_url"), // 구글/카카오 프로필 사진 써도 됨
        verifiedAt: timestamp("verified_at", { withTimezone: true }),
        lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        emailUnique: uniqueIndex("users_email_unique").on(table.email),
    }),
);

export const usersRelations = relations(users, ({ many }) => ({
    workspaceMembers: many(workspaceMembers),
}));

