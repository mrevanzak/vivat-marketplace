import { z } from "zod";

import { gt } from "@vivat/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getProducts: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.products.findMany({
        columns: {
          id: true,
          name: true,
          image: true,
          price: true,
        },
        with: {
          user: true,
        },
        where: (products, { like, and }) =>
          and(
            like(products.name, `%${input.query.toLowerCase()}%`),
            gt(products.stock, 0),
          ),
      });
    }),
  showProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return (
        (await ctx.db.query.products.findFirst({
          with: {
            user: true,
            category: true,
          },
          where: (products, { eq }) => eq(products.id, input.id),
        })) ?? null
      );
    }),
});
