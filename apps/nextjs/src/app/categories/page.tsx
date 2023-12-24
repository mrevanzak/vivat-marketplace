import CategorieList from "@/components/categories/CategoryList";
import NewCategorieModal from "@/components/categories/CategoryModal";

import { getCategories } from "@vivat/api/src/services/categories/queries";

export default async function Categories() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-3xl p-5 sm:pt-4 md:p-0">
      <div className="flex justify-between">
        <h1 className="my-2 text-2xl font-semibold">Categories</h1>
        <NewCategorieModal />
      </div>
      <CategorieList categories={categories} />
    </main>
  );
}
