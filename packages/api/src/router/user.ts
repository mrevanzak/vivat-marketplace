import { addressIdSchema, addresses, insertAddressSchema } from "@vivat/db/schema/addresses";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq } from "@vivat/db";

export const userRouter = createTRPCRouter({
  getAddresses: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.query.addresses.findMany({
        where: (addresses, { eq }) => eq(addresses.userId, ctx.auth.userId),
      });
    }),
  getDefaultAddress: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.query.addresses.findFirst({
        where: (addresses, { and, eq }) => and(eq(addresses.userId, ctx.auth.userId), eq(addresses.default, true)),
      });
    }),
  createAddress: protectedProcedure
    .input(insertAddressSchema)
    .query(({ input, ctx }) => {
      return ctx.db.insert(addresses).values({
        ...input,
        userId: ctx.auth.userId,
      });
    }),
  setDefaultAddress: protectedProcedure
    .input(addressIdSchema)
    .query(async ({ input, ctx }) => {
      await ctx.db
        .update(addresses)
        .set({ default: false });

      return ctx.db
        .update(addresses)
        .set({ default: true })
        .where(and(eq(addresses.userId, ctx.auth.userId), eq(addresses.id, input.id)));
    }),
});
