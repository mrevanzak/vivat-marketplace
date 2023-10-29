import { relations, sql } from "drizzle-orm";
import { int, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users, usersToProducts } from "./auth";

export const products = mySqlTable("product", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  price: int("price").notNull(),
  stock: int("stock").notNull(),
  image: varchar("image", { length: 256 }).notNull(),
  sellerId: varchar("sellerId", { length: 36 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const productsRelations = relations(products, ({ many, one }) => ({
  user: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  usersToProducts: many(usersToProducts),
}));
