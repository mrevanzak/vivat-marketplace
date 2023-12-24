import ProductTable from "@/components/ProductTable";
import { server } from "@/lib/server";

export default async function OrdersPage() {
  const data = await server.admin.getPendingProducts.query();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="rounded-lg border p-2 shadow-sm">
        <ProductTable initialData={data} />
      </div>
    </main>
  );
}
