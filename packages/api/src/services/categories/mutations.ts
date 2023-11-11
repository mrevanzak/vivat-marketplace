import { eq } from "drizzle-orm";

import { db } from "@vivat/db";
import type {
  CategoryId,
  NewCategoryParams,
  UpdateCategoryParams,
} from "@vivat/db/schema/categories";
import {
  categories,
  categoryIdSchema,
  insertCategorySchema,
  updateCategorySchema,
} from "@vivat/db/schema/categories";

export const createCategory = async (categorie: NewCategoryParams) => {
  const newCategory = insertCategorySchema.parse(categorie);
  try {
    await db.insert(categories).values(newCategory);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateCategory = async (
  id: CategoryId,
  categorie: UpdateCategoryParams,
) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  const newCategory = updateCategorySchema.parse(categorie);
  try {
    await db
      .update(categories)
      .set(newCategory)
      .where(eq(categories.id, categoryId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteCategory = async (id: CategoryId) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  try {
    await db.delete(categories).where(eq(categories.id, categoryId));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
