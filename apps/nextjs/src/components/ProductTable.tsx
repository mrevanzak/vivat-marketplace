"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { server } from "@/lib/server";
import { rupiahFormatter } from "@/lib/utils";
import { omit } from "lodash";
import { Loader2 } from "lucide-react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

export default function ProductTable({
  initialData,
}: {
  initialData: Awaited<
    ReturnType<typeof server.admin.getPendingProducts.query>
  >;
}) {
  const utils = api.useUtils();
  const { data } = api.admin.getPendingProducts.useQuery(undefined, {
    initialData,
  });

  const [productId, setProductId] = useState<string>();
  const { data: productDetails, isLoading } = api.product.showProduct.useQuery(
    { id: productId! },
    {
      enabled: !!productId,
    },
  );
  const productForm = omit(productDetails, [
    "id",
    "seller",
    "createdAt",
    "updatedAt",
    "sellerId",
    "seller",
    "category",
    "categoryId",
    "approved",
  ]);
  const approveProduct = api.admin.approveProduct.useMutation({
    onSuccess: () => {
      setProductId(undefined);
      void utils.admin.getPendingProducts.invalidate();
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Product</TableHead>
          <TableHead className="min-w-[150px]">Name</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead className="w-12">Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No products need to be approved.
            </TableCell>
          </TableRow>
        )}
        {data.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="line-clamp-1 font-medium">
              {product.id}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Image
                  src={product.seller.imageUrl}
                  alt={product.seller.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span>{product.seller.name}</span>
              </div>
            </TableCell>
            <TableCell className="">{rupiahFormatter(product.price)}</TableCell>
            <TableCell className="text-right">
              <Dialog
                open={productId === product.id}
                onOpenChange={(isOpen) =>
                  setProductId(isOpen ? product.id : undefined)
                }
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <IoEllipsisVerticalSharp />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                      <DropdownMenuItem>View product</DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                  </DialogHeader>
                  {isLoading && (
                    <div className="flex h-48 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                  <div className="space-y-4">
                    {Object.entries(productForm ?? {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col space-y-2 text-sm"
                      >
                        <Label htmlFor={key}>
                          {key.slice(0, 1).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                        </Label>
                        {key === "image" ? (
                          <Image
                            src={value?.toString() ?? ""}
                            alt={product.name}
                            width={200}
                            height={200}
                          />
                        ) : (
                          <Input id={key} defaultValue={value ?? ""} disabled />
                        )}
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button
                      loading={approveProduct.isPending}
                      onClick={() =>
                        productId && approveProduct.mutate({ productId })
                      }
                    >
                      Approve
                    </Button>
                    {/* <Button */}
                    {/*   loading={approveProduct.isPending} */}
                    {/*   variant="destructive" */}
                    {/* > */}
                    {/*   Reject */}
                    {/* </Button> */}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
