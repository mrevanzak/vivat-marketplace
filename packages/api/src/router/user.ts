import { addresses, insertAddressSchema } from "@vivat/db/schema/addresses";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAddresses: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.query.addresses.findMany({
        where: (addresses, { eq }) => eq(addresses.userId, ctx.auth.userId),
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
});
