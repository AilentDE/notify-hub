import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const webhooksTable = sqliteTable("webhooks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  origin: text("origin").notNull(), // APPLICATION, SYSTEM etc.
  category: text("category").notNull(), // DISCORD, TEAMS etc.
  endpoint: text("endpoint").notNull(), // URL to send notifications to
  isCanceled: integer("isCanceled", { mode: "boolean" })
    .default(false)
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});
