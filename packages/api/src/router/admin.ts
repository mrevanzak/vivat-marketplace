import { alias } from "drizzle-orm/mysql-core";

import { eq, sql } from "@vivat/db";
import { addresses } from "@vivat/db/schema/addresses";
import { orders } from "@vivat/db/schema/orders";
import { products } from "@vivat/db/schema/products";
import { users } from "@vivat/db/schema/users";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  getOrders: adminProcedure.query(async ({ ctx }) => {
    const seller = alias(users, "seller");

    return await ctx.db
      .select({
        createdAt: orders.createdAt,
        id: orders.id,
        status: orders.status,
        products,
        buyer: users,
        seller,
        totalPrice: orders.totalPrice,
      })
      .from(orders)
      .innerJoin(addresses, eq(orders.addressId, addresses.id))
      .innerJoin(users, eq(addresses.userId, users.id))
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(seller, eq(products.sellerId, seller.id))
      .orderBy(sql`(CASE ${orders.status} WHEN 'payment' THEN 0 ELSE 1 END), ${orders.createdAt} DESC`) 
  }),
});
