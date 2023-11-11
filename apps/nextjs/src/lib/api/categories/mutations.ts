import { db } from "@/server/db/index";
import { eq } from "drizzle-orm";
import { 
  CategorieId, 
  NewCategorieParams,
  UpdateCategorieParams, 
  updateCategorieSchema,
  insertCategorieSchema, 
  categories,
  categorieIdSchema 
} from "@/server/db/schema/categories";

export const createCategorie = async (categorie: NewCategorieParams) => {
  const newCategorie = insertCategorieSchema.parse(categorie);
  try {
    await db.insert(categories).values(newCategorie)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateCategorie = async (id: CategorieId, categorie: UpdateCategorieParams) => {
  const { id: categorieId } = categorieIdSchema.parse({ id });
  const newCategorie = updateCategorieSchema.parse(categorie);
  try {
    await db
     .update(categories)
     .set(newCategorie)
     .where(eq(categories.id, categorieId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteCategorie = async (id: CategorieId) => {
  const { id: categorieId } = categorieIdSchema.parse({ id });
  try {
    await db.delete(categories).where(eq(categories.id, categorieId!))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

