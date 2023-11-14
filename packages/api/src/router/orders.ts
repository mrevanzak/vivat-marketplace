import { v4 } from "uuid";

import { eq } from "@vivat/db";
import {
  insertOrderParams,
  orderIdSchema,
  orders,
} from "@vivat/db/schema/orders";
import { createPaymentParams, payments } from "@vivat/db/schema/payments";

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
      return await ctx.db.transaction(async (db) => {
        await db
          .update(payments)
          .set(input)
          .where(eq(payments.orderId, input.orderId));
        await db
          .update(orders)
          .set({
            status: "payment",
          })
          .where(eq(orders.id, input.orderId));
      });
    }),
});
