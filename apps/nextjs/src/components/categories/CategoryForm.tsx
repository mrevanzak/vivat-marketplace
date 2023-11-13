"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { schema } from "@vivat/db";
import type { Category, NewCategoryParams } from "@vivat/db/schema/categories";

const CategoryForm = ({
  category,
  closeModal,
}: {
  category?: Category;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!category?.id;

  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof schema.insertCategoryParams>>({
    resolver: zodResolver(schema.insertCategoryParams),
    defaultValues: category ?? {
      name: "",
      imageUrl: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.category.getCategories.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `category ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createCategory, isPending: isCreating } =
    api.category.createCategory.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    api.category.updateCategory.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteCategory, isPending: isDeleting } =
    api.category.deleteCategory.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewCategoryParams) => {
    if (editing) {
      updateCategory({ ...values, id: category.id });
    } else {
      createCategory(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteCategory({ id: category.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CategoryForm;
