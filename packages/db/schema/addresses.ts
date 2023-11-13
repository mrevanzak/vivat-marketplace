import { relations, sql } from "drizzle-orm";
import { boolean, char, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

import { mySqlTable } from "./_table";
import { users } from "./users";

export const addresses = mySqlTable("addresses", {
  id: varchar("id", { length: 36 })
    .notNull()
    .primaryKey()
    .default(sql`(UUID())`),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  title: varchar("title", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  zipCode: char("zip_code", { length: 5 }).notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  default: boolean("default").notNull().default(false),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const insertAddressSchema = createInsertSchema(addresses).omit({
  userId: true,
});
export const addressIdSchema = insertAddressSchema
  .pick({ id: true })
  .required();
