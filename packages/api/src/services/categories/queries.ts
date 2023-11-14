import { eq } from "drizzle-orm";

import { db } from "@vivat/db";
import type { CategoryId } from "@vivat/db/schema/categories";
import { categories, categoryIdSchema } from "@vivat/db/schema/categories";

export const getCategories = async () => {
  return await db.select().from(categories).orderBy(categories.name);
};

export const getCategoryById = async (id: CategoryId) => {
  const { id: categorieId } = categoryIdSchema.parse({ id });
  const [c] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categorieId));
  return { categorie: c };
};
