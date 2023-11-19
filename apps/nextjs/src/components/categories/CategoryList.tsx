"use client";

import { api } from "@/utils/api";

import type { services } from "@vivat/api";

import CategoryModal from "./CategoryModal";

type CompleteCategory = Awaited<
  ReturnType<typeof services.getCategories>
>[number];

export default function CategoryList({
  categories,
}: {
  categories: CompleteCategory[];
}) {
  const { data: c } = api.category.getCategories.useQuery(
    { partial: false },
    {
      initialData: categories,
      refetchOnMount: false,
    },
  );

  if (c.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.map((category) => (
        <Category category={category} key={category.id} />
      ))}
    </ul>
  );
}

const Category = ({ category }: { category: CompleteCategory }) => {
  return (
    <li className="my-2 flex justify-between">
      <div className="w-full">
        <div>{category.name}</div>
      </div>
      <CategoryModal category={category} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No categories
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new category.
      </p>
      <div className="mt-6">
        <CategoryModal emptyState={true} />
      </div>
    </div>
  );
};
