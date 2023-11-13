import { relations, sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { mySqlTable } from "./_table";
import { products } from "./products";

export const categories = mySqlTable("categories", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  name: varchar("name", { length: 256 }).notNull(),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const categorysRelations = relations(categories, ({ many }) => ({
  product: many(products),
}));

// Schema for categorys - used to validate API requests
export const insertCategorySchema = createInsertSchema(categories);
export const insertCategoryParams = createSelectSchema(categories, {}).omit({
  id: true,
});
export const updateCategorySchema = createSelectSchema(categories);
export const updateCategoryParams = createSelectSchema(categories, {});
export const categoryIdSchema = updateCategoryParams.pick({ id: true });

// Types for categorys - used to type API request params and within Components
export type Category = z.infer<typeof updateCategoryParams>;
export type NewCategory = z.infer<typeof insertCategoryParams>;
export type NewCategoryParams = z.infer<typeof insertCategoryParams>;
export type UpdateCategoryParams = z.infer<typeof updateCategoryParams>;
export type CategoryId = z.infer<typeof categoryIdSchema>["id"];
