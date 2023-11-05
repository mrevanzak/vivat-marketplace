import { relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { products } from "./product";

export const categories = mySqlTable("category", {
  name: varchar("name", { length: 255 }).notNull().primaryKey(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  product: many(products),
}));
