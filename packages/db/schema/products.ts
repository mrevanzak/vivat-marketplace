import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { mySqlTable } from "./_table";
import { categories } from "./categories";
import { users } from "./users";

export const products = mySqlTable(
  "products",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .default(sql`(UUID())`),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    price: int("price").notNull(),
    stock: int("stock").notNull(),
    image: varchar("image", { length: 256 }).notNull(),
    approved: boolean("approved").notNull().default(false),
    sellerId: varchar("seller_id", { length: 36 }).notNull(),
    categoryId: varchar("category_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (products) => {
    return {
      sellerIdIndex: index("seller_id_idx").on(products.sellerId),
    };
  },
);

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// Schema for products - used to validate API requests
export const insertProductParams = createInsertSchema(products, {
  price: z.coerce.number(),
  stock: z.coerce.number(),
}).omit({
  id: true,
  sellerId: true,
});
export const updateProductSchema = createSelectSchema(products);
export const updateProductParams = createSelectSchema(products, {
  price: z.coerce.number(),
  stock: z.coerce.number(),
}).omit({
  sellerId: true,
  createdAt: true,
  updatedAt: true,
  approved: true,
});
export const productIdSchema = updateProductSchema.pick({ id: true });
