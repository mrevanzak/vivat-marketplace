import { relations, sql } from "drizzle-orm";
import {
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { products } from "./product";

export const users = mySqlTable("user", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
  imageUrl: varchar("image_url", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  product: many(products),
  usersToProducts: many(usersToProducts),
}));

export const usersToProducts = mySqlTable(
  "users_to_products",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    productId: varchar("product_id", { length: 255 }).notNull(),
  },
  (usersToProducts) => ({
    compoundKey: primaryKey(usersToProducts.userId, usersToProducts.productId),
  }),
);

export const usersToProductsRelations = relations(
  usersToProducts,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToProducts.userId],
      references: [users.id],
    }),
    product: one(products, {
      fields: [usersToProducts.productId],
      references: [products.id],
    }),
  }),
);
