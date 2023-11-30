import { relations, sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { addresses } from "./addresses";
import { orders } from "./orders";
import { products } from "./products";

export const users = mySqlTable("users", {
  id: varchar("id", { length: 256 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  major: varchar("major", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  product: many(products),
  address: many(addresses),
  order: many(orders),
}));
