import {
  categoryIdSchema,
  insertCategoryParams,
  updateCategoryParams,
} from "@vivat/db/schema/categories";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/categories/mutations";
import { getCategories, getCategoryById } from "../services/categories/queries";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async () => {
    return getCategories();
  }),
  getCategoryById: protectedProcedure
    .input(categoryIdSchema)
    .query(async ({ input }) => {
      return getCategoryById(input.id);
    }),
  createCategory: protectedProcedure
    .input(insertCategoryParams)
    .mutation(async ({ input }) => {
      return createCategory(input);
    }),
  updateCategory: protectedProcedure
    .input(updateCategoryParams)
    .mutation(async ({ input }) => {
      return updateCategory(input.id, input);
    }),
  deleteCategory: protectedProcedure
    .input(categoryIdSchema)
    .mutation(async ({ input }) => {
      return deleteCategory(input.id);
    }),
});