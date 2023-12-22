"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn, rupiahFormatter } from "@/lib/utils";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

export default function OrderTable({
  initialData,
}: {
  initialData: Awaited<ReturnType<typeof server.admin.getOrders.query>>;
}) {
  const { data } = api.admin.getOrders.useQuery(undefined, {
    initialData,
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order</TableHead>
          <TableHead className="min-w-[150px]">Customer</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="hidden sm:table-cell">Product</TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            Total
          </TableHead>
          <TableHead className="w-12">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="line-clamp-1 font-medium">
              {order.id}
            </TableCell>
            <TableCell>{order.buyer.name}</TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {order.products.name}
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell">
              {rupiahFormatter(order.totalPrice)}
            </TableCell>
            <TableCell className="whitespace-nowrap uppercase">
              <span
                className={cn(
                  "mr-2 inline-block h-2 w-2 rounded-full",
                  order.status === "done"
                    ? "bg-green-500"
                    : order.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-yellow-500",
                )}
              />
              {order.status}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <IoEllipsisVerticalSharp />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View order</DropdownMenuItem>
                  <DropdownMenuItem>Customer details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
