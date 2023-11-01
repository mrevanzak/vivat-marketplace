import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getProduct: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.products.findMany();
  }),
});
