"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS } from "@/constant/router";
import { UserButton } from "@clerk/nextjs";

import { Input } from "./ui/input";

export default function Header() {
  const activeLink = usePathname();
  const link = LINKS.find(({ href }) => href === activeLink);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <Link className="lg:hidden" href="#">
        {link?.icon}
      </Link>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{link?.label}</h1>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end gap-4">
        <Input
          type="search"
          placeholder="Search..."
          className="w-[100px] md:w-[300px]"
        />
        <UserButton />
      </div>
    </header>
  );
}
