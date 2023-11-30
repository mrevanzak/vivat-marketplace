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
      z.object({
        query: z.string(),
        categoryId: z.string().uuid().optional(),
        sellerId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.products.findMany({
        columns: {
          id: true,
          name: true,
          image: true,
          price: true,
          approved: true,
          stock: true,
        },
        with: {
          seller: true,
        },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
        where: (products, { like, and, eq, gt }) =>
          and(
            like(products.name, `%${input.query.toLowerCase()}%`),
            ...(input.categoryId
              ? [eq(products.categoryId, input.categoryId)]
              : []),
            ...(input.sellerId
              ? [eq(products.sellerId, input.sellerId)]
              : [gt(products.stock, 0), eq(products.approved, true)]),
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
            seller: true,
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
