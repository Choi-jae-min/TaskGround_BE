import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    koreaName: text("koreaName").notNull(),
    englishName: text("englishName").notNull(),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
