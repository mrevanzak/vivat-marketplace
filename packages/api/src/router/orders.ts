import { TRPCError } from "@trpc/server";
import { alias } from "drizzle-orm/mysql-core";
import { v4 } from "uuid";
import { z } from "zod";

import type { SQL } from "@vivat/db";
import { and, eq, not, sql } from "@vivat/db";
import { addresses } from "@vivat/db/schema/addresses";
import { logOrders } from "@vivat/db/schema/log-orders";
import {
  insertOrderParams,
  orderConfirmParams,
  orderIdSchema,
  orders,
} from "@vivat/db/schema/orders";
import { createPaymentParams, payments } from "@vivat/db/schema/payments";
import { products } from "@vivat/db/schema/products";
import { createShippingParams, shippings } from "@vivat/db/schema/shippings";
import { users } from "@vivat/db/schema/users";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  checkout: protectedProcedure
    .input(insertOrderParams)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (tx) => {
        const orderId = v4();

        const product = await tx.query.products.findFirst({
          columns: {
            id: true,
            stock: true,
          },
          where: (product, { eq }) => eq(product.id, input.productId),
        });
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }
        if (product?.stock < 1) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Product out of stock",
          });
        }

        await tx.insert(logOrders).values({
          orderId,
        });
        await tx.insert(orders).values({
          ...input,
          id: orderId,
        });
        return { orderId };
      });
    }),
  getOrders: protectedProcedure
    .input(
      z.object({
        isSeller: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const seller = alias(users, "seller");

      const where: SQL[] = [];
      input.isSeller
        ? where.push(eq(seller.id, ctx.auth.userId))
        : where.push(eq(users.id, ctx.auth.userId));
      if (input.isSeller) {
        where.push(not(eq(orders.status, "pending")));
      }

      return await ctx.db
        .select({
          id: orders.id,
          status: orders.status,
          products,
          user: input.isSeller ? users : seller,
        })
        .from(orders)
        .innerJoin(addresses, eq(orders.addressId, addresses.id))
        .innerJoin(users, eq(addresses.userId, users.id))
        .innerJoin(products, eq(orders.productId, products.id))
        .innerJoin(seller, eq(products.sellerId, seller.id))
        .where(and(...where));
    }),
  showOrder: protectedProcedure
    .input(orderIdSchema)
    .query(async ({ input, ctx }) => {
      return (
        (await ctx.db.query.orders.findFirst({
          with: {
            product: true,
            address: true,
            shipping: true,
            logOrders: {
              orderBy: (logOrders, { asc }) => asc(logOrders.timestamp),
            },
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
        await ctx.db.transaction(async (tx) => {
          await tx.insert(logOrders).values({
            orderId: input.orderId,
            status: "cancelled",
          });
          await tx
            .update(orders)
            .set({
              status: "cancelled",
            })
            .where(eq(orders.id, input.orderId));
        });
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
        await tx.insert(logOrders).values({
          orderId: input.orderId,
          status: "payment",
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
  confirmOrder: protectedProcedure
    .input(orderConfirmParams)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx.insert(logOrders).values({
          orderId: input.id,
          status: input.status,
        });
        await tx
          .update(orders)
          .set({
            status: input.status,
          })
          .where(eq(orders.id, input.id));
      });
    }),
  confirmShipping: protectedProcedure
    .input(createShippingParams)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (tx) => {
        const shippingId = v4();

        await tx.insert(logOrders).values({
          orderId: input.orderId,
          status: "shipped",
        });
        await tx
          .update(orders)
          .set({
            status: "shipped",
            shippingId,
          })
          .where(eq(orders.id, input.orderId));
        await tx.insert(shippings).values({
          ...input,
          id: shippingId,
        });
      });
    }),
});
