import { z } from "zod";

import { eq } from "@vivat/db";
import {
  insertProductParams,
  productIdSchema,
  products,
  updateProductParams,
} from "@vivat/db/schema/products";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getProducts: protectedProcedure
    .input(
      z.object({ query: z.string(), categoryId: z.string().uuid().optional() }),
    )
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
        where: (products, { like, and, eq, gt }) =>
          and(
            like(products.name, `%${input.query.toLowerCase()}%`),
            gt(products.stock, 0),
            ...(input.categoryId
              ? [eq(products.categoryId, input.categoryId)]
              : []),
          ),
      });
    }),
  addProduct: protectedProcedure
    .input(insertProductParams)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .insert(products)
        .values({ ...input, sellerId: ctx.auth.userId });
    }),
  showProduct: protectedProcedure
    .input(productIdSchema)
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
  editProduct: protectedProcedure
    .input(updateProductParams)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .update(products)
        .set({ ...input })
        .where(eq(products.id, input.id));
    }),
});
