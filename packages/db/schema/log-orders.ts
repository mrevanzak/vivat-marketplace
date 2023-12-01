import { relations, sql } from "drizzle-orm";
import { mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { orders } from "./orders";

export const logOrders = mySqlTable("logOrders", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  status: mysqlEnum("status", [
    "pending",
    "payment",
    "confirmed",
    "shipped",
    "cancelled",
    "done",
  ])
    .notNull()
    .default("pending"),
  timestamp: timestamp("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
});

export const logOrdersRelations = relations(logOrders, ({ one }) => ({
  order: one(orders, {
    fields: [logOrders.orderId],
    references: [orders.id],
  }),
}));
