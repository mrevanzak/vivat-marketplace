import { and, eq } from "@vivat/db";
import {
  addresses,
  addressIdSchema,
  insertAddressSchema,
} from "@vivat/db/schema/addresses";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAddresses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.addresses.findMany({
      where: (addresses, { eq }) => eq(addresses.userId, ctx.auth.userId),
      orderBy: (addresses, { desc }) => [desc(addresses.default)],
    });
  }),
  getDefaultAddress: protectedProcedure.query(async ({ ctx }) => {
    return (
      (await ctx.db.query.addresses.findFirst({
        where: (addresses, { and, eq }) =>
          and(
            eq(addresses.userId, ctx.auth.userId),
            eq(addresses.default, true),
          ),
      })) ?? null
    );
  }),
  createAddress: protectedProcedure
    .input(insertAddressSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(addresses).values({
        ...input,
        userId: ctx.auth.userId,
      });
    }),
  setDefaultAddress: protectedProcedure
    .input(addressIdSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.update(addresses).set({ default: false });

      return await ctx.db
        .update(addresses)
        .set({ default: true })
        .where(
          and(
            eq(addresses.userId, ctx.auth.userId),
            eq(addresses.id, input.id),
          ),
        );
    }),
  deleteAddress: protectedProcedure
    .input(addressIdSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(addresses)
        .where(
          and(
            eq(addresses.userId, ctx.auth.userId),
            eq(addresses.id, input.id),
          ),
        );
    }),
});
