import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {InferSelectModel} from "drizzle-orm";

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

// 单词本 - vocabulary
export const vocabulary = sqliteTable('vocabularys', {
  id: int().primaryKey({autoIncrement: true}),
  original: text('original', {length: 256}).notNull(),
  translation: text('translation', {length: 256}).notNull(),
  phonetic: text('phonetic', {length: 256}),
  tags: text('tags', {length: 256}),
  level: int(),
  created_at: int(),
  updated_at: int(),
});

export type Vocabulary = InferSelectModel<typeof vocabulary>;