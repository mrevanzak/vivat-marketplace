"use client";

import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

export const runtime = "edge";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { data } = api.product.showProduct.useQuery({
    id: "313501f1-7be4-11ee-a239-7a04ac76345d",
  });
  console.log(data);
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-pink-400">T3</span> Turbo
        </h1>
        {isSignedIn ? <SignOutButton /> : <SignIn />}
      </div>
    </main>
  );
}
