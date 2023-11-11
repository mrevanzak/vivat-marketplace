import CategorieList from "@/components/categories/CategoryList";
import NewCategorieModal from "@/components/categories/CategoryModal";
import { getCategories } from "@vivat/api/src/services/categories/queries";

export default async function Categories() {
  const { categories } = await getCategories();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Categories</h1>
        <NewCategorieModal />
      </div>
      <CategorieList categories={categories} />
    </main>
  );
}
