import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getProduct: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.db.query.products.findMany({
        with: {
          user: true,
        },
        where: (products, { like }) => like(products.name, `%${input.toLowerCase()}%`),
      });
    }),
});
