import { relations, sql } from "drizzle-orm";
import { boolean, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./users";
import { createInsertSchema } from "drizzle-zod";

export const addresses = mySqlTable("addresses", {
	id: varchar("id", { length: 36 })
		.notNull()
		.primaryKey()
		.default(sql`(UUID())`),
	title: varchar("title", { length: 255 }).notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	zipCode: varchar("zip_code", { length: 255 }).notNull(),
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

export const insertAddressSchema = createInsertSchema(addresses);
export const addressIdSchema = insertAddressSchema.pick({ id: true }).required();