import { relations, sql } from "drizzle-orm";
import { int, mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { addresses } from "./addresses";
import { logOrders } from "./log-orders";
import { payments } from "./payments";
import { products } from "./products";
import { shippings } from "./shippings";

export const orders = mySqlTable("orders", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  status: mysqlEnum("status", [
    "pending",
    "payment",
    "verified",
    "confirmed",
    "shipped",
    "cancelled",
    "done",
  ])
    .notNull()
    .default("pending"),
  totalPrice: int("total_price").notNull(),
  courier: varchar("courier", { length: 255 }).notNull(),
  note: varchar("note", { length: 255 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  addressId: varchar("address_id", { length: 255 }).notNull(),
  paymentId: varchar("payment_id", { length: 255 }),
  shippingId: varchar("shippings_id", { length: 255 }),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  payment: one(payments, {
    fields: [orders.paymentId],
    references: [payments.id],
  }),
  shipping: one(shippings, {
    fields: [orders.shippingId],
    references: [shippings.id],
  }),
  logOrders: many(logOrders),
}));

export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderParams = insertOrderSchema.omit({
  id: true,
});
export const orderIdSchema = insertOrderSchema.pick({ id: true }).required();
export const orderStatusEnum = createSelectSchema(orders)
  .pick({
    status: true,
  })
  .transform((schema) => schema.status);
export const orderConfirmParams = createSelectSchema(orders).pick({
  id: true,
  status: true,
});