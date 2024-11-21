import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Post = sqliteTable("suit_post", {
  id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    startTime: int(),
    totalPurchaseCount: int(),
    user: int(),
    username: text(),
    owner: int(),
    image_cover: text(),
});
