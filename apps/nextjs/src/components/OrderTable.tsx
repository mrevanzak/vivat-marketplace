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
import { cn, rupiahFormatter } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

export default function OrderTable({
  initialData,
}: {
  initialData: Awaited<ReturnType<typeof server.admin.getOrders.query>>;
}) {
  const utils = api.useUtils();
  const { data } = api.admin.getOrders.useQuery(undefined, {
    initialData,
  });

  const [orderId, setOrderId] = useState<string>();
  const { data: paymentDetails, isLoading } =
    api.admin.getPaymentDetails.useQuery(
      { orderId },
      {
        enabled: !!orderId,
      },
    );
  const verifyPayment = api.admin.verifyPayment.useMutation({
    onSuccess: () => {
      setOrderId(undefined);
      void utils.admin.getOrders.invalidate();
    },
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
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No products need to be approved.
            </TableCell>
          </TableRow>
        )}
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
              <Dialog
                open={orderId === order.id}
                onOpenChange={(isOpen) =>
                  setOrderId(isOpen ? order.id : undefined)
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
                    <DropdownMenuItem>View order</DropdownMenuItem>
                    {order.status === "payment" && (
                      <DialogTrigger asChild>
                        <DropdownMenuItem>
                          Payment confirmation
                        </DropdownMenuItem>
                      </DialogTrigger>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment confirmation</DialogTitle>
                  </DialogHeader>
                  {isLoading && (
                    <div className="flex h-48 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                  <div className="space-y-4">
                    {Object.entries(paymentDetails ?? {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col space-y-2 text-sm"
                        >
                          <Label htmlFor={key}>
                            {key.slice(0, 1).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, " $1")}
                          </Label>
                          {key === "proof" ? (
                            <Image
                              src={value}
                              alt="Payment proof"
                              width={200}
                              height={200}
                            />
                          ) : (
                            <Input
                              id={key}
                              defaultValue={value ?? ""}
                              disabled
                            />
                          )}
                        </div>
                      ),
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      loading={
                        verifyPayment.variables?.status === "verified" &&
                        verifyPayment.isPending
                      }
                      onClick={() =>
                        orderId &&
                        verifyPayment.mutate({ orderId, status: "verified" })
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      loading={
                        verifyPayment.variables?.status === "cancelled" &&
                        verifyPayment.isPending
                      }
                      variant="destructive"
                      onClick={() =>
                        orderId &&
                        verifyPayment.mutate({ orderId, status: "cancelled" })
                      }
                    >
                      Reject
                    </Button>
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
