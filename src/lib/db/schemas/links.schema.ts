import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const linksTable = pgTable("links", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    shortUrl: varchar('short_url', { length: 255 }).notNull(),
    originalUrl: varchar('original_url', { length: 255 }).notNull(),
});

