import { relations, sql } from "drizzle-orm";
import { int, mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { orders } from "./orders";

export const payments = mySqlTable("payments", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  proof: varchar("proof", { length: 255 }).notNull(),
  bankAccount: varchar("bank_account", { length: 255 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  bankHolder: varchar("bank_holder", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const createPaymentSchema = createInsertSchema(payments);
export const createPaymentParams = createPaymentSchema.omit({
  id: true,
});