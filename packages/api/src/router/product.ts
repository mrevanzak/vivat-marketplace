import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getProduct: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.query.products.findMany({
        columns: {
          id: true,
          name: true,
          image: true,
          price: true,
        },
        with: {
          user: true,
        },
        where: (products, { like }) =>
          like(products.name, `%${input.query.toLowerCase()}%`),
      });
    }),
  showProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.query.products.findFirst({
        with: {
          user: true,
          category: true,
        },
        where: (products, { eq }) => eq(products.id, input.id),
      });
    }),
});
