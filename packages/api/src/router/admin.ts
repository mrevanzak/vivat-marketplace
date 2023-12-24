import { TRPCError } from "@trpc/server";
import { alias } from "drizzle-orm/mysql-core";
import { z } from "zod";

import { eq, sql } from "@vivat/db";
import { addresses } from "@vivat/db/schema/addresses";
import { logOrders } from "@vivat/db/schema/log-orders";
import { orders } from "@vivat/db/schema/orders";
import { products } from "@vivat/db/schema/products";
import { users } from "@vivat/db/schema/users";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  getPendingProducts: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.products.findMany({
      with: {
        seller: true,
      },
      where: (product) => eq(product.approved, false),
    });
  }),
  approveProduct: adminProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .update(products)
        .set({
          approved: true,
        })
        .where(eq(products.id, input.productId));
    }),
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
      .orderBy(
        sql`(CASE ${orders.status} WHEN 'payment' THEN 0 ELSE 1 END), ${orders.createdAt} DESC`,
      );
  }),
  getPaymentDetails: adminProcedure
    .input(
      z.object({
        orderId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!input.orderId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "orderId is required",
        });

      if (input.orderId)
        return await ctx.db.query.payments.findFirst({
          columns: {
            id: false,
            orderId: false,
            createdAt: false,
            updatedAt: false,
          },
          where: (payment) => eq(payment.orderId, input.orderId!),
        });
    }),
  verifyPayment: adminProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        status: z.enum(["verified", "cancelled"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx.insert(logOrders).values({
          orderId: input.orderId,
          status: input.status,
        });
        await tx
          .update(orders)
          .set({
            status: input.status,
          })
          .where(eq(orders.id, input.orderId));
      });
    }),
});
