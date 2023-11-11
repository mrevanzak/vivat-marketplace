import { db } from "@/server/db/index";
import { eq } from "drizzle-orm";
import { type CategorieId, categorieIdSchema, categories } from "@/server/db/schema/categories";

export const getCategories = async () => {
  const c = await db.select().from(categories);
  return { categories: c };
};

export const getCategorieById = async (id: CategorieId) => {
  const { id: categorieId } = categorieIdSchema.parse({ id });
  const [c] = await db.select().from(categories).where(eq(categories.id, categorieId));
  return { categorie: c };
};

