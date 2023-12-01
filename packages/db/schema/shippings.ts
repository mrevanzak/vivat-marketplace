import { relations, sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { orders } from "./orders";

export const shippings = mySqlTable("shippings", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  proof: varchar("proof", { length: 255 }).notNull(),
  courier: varchar("courier", { length: 255 }).notNull(),
  trackingNumber: varchar("tracking_number", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
});

export const shippingsRelations = relations(shippings, ({ one }) => ({
  order: one(orders, {
    fields: [shippings.orderId],
    references: [orders.id],
  }),
}));

export const createShippingSchema = createInsertSchema(shippings);
export const createShippingParams = createShippingSchema.omit({
  id: true,
});
