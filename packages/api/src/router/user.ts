import { z } from "zod";

import { and, eq } from "@vivat/db";
import {
  addresses,
  addressIdSchema,
  insertAddressSchema,
} from "@vivat/db/schema/addresses";
import { users } from "@vivat/db/schema/users";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  checkMajor: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      columns: {
        major: true,
      },
      where: (users, { eq }) => eq(users.id, ctx.auth.userId),
    });
  }),
  setMajor: protectedProcedure
    .input(z.object({ major: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(users)
        .set({ major: input.major })
        .where(eq(users.id, ctx.auth.userId));
    }),
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
      await ctx.db
        .update(addresses)
        .set({ default: false })
        .where(eq(addresses.userId, ctx.auth.userId));

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
