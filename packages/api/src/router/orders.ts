import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

import { eq, sql } from "@vivat/db";
import { addresses } from "@vivat/db/schema/addresses";
import {
  insertOrderParams,
  orderIdSchema,
  orders,
} from "@vivat/db/schema/orders";
import { createPaymentParams, payments } from "@vivat/db/schema/payments";
import { products } from "@vivat/db/schema/products";
import { users } from "@vivat/db/schema/users";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  checkout: protectedProcedure
    .input(insertOrderParams)
    .mutation(async ({ input, ctx }) => {
      const orderId = v4();

      await ctx.db.insert(orders).values({
        ...input,
        id: orderId,
      });
      return { orderId };
    }),
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ id: orders.id, status: orders.status, products, users })
      .from(orders)
      .innerJoin(addresses, eq(orders.addressId, addresses.id))
      .innerJoin(users, eq(addresses.userId, users.id))
      .innerJoin(products, eq(orders.productId, products.id))
      .where(eq(users.id, ctx.auth.userId));
  }),
  showOrder: protectedProcedure
    .input(orderIdSchema)
    .query(async ({ input, ctx }) => {
      return (
        (await ctx.db.query.orders.findFirst({
          with: {
            product: true,
            address: true,
          },
          where: (order, { eq }) => eq(order.id, input.id),
        })) ?? null
      );
    }),
  confirmPayment: protectedProcedure
    .input(createPaymentParams)
    .mutation(async ({ input, ctx }) => {
      const paymentId = v4();

      const order = await ctx.db.query.orders.findFirst({
        columns: {
          id: true,
        },
        with: {
          product: {
            columns: {
              id: true,
              stock: true,
            },
          },
        },
        where: (order, { eq }) => eq(order.id, input.orderId),
      });
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      if (order.product.stock < 1) {
        await ctx.db
          .update(orders)
          .set({
            status: "cancelled",
          })
          .where(eq(orders.id, input.orderId));
        throw new TRPCError({
          code: "CONFLICT",
          message: "Product out of stock",
        });
      }

      return await ctx.db.transaction(async (tx) => {
        await tx.insert(payments).values({
          ...input,
          id: paymentId,
        });
        await tx
          .update(orders)
          .set({
            status: "payment",
            paymentId,
          })
          .where(eq(orders.id, input.orderId));
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - 1`,
          })
          .where(eq(products.id, order.product.id));
      });
    }),
});
