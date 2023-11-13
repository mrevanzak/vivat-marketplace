import { insertOrderParams, orders } from "@vivat/db/schema/orders";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  checkout: protectedProcedure
    .input(insertOrderParams)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(orders).values(input);
    }),
});
