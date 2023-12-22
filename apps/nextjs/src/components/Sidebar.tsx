"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { LINKS } from "@/constant/router";

export default function Sidebar() {
  const activeLink = usePathname();

  return (
    <div className="hidden w-1/5 border-r bg-gray-100/40 dark:bg-gray-800/40 lg:flex lg:flex-col">
      <div className="flex h-[60px] items-center px-6">
        <Link className="flex items-center gap-1 font-semibold" href="#">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          Vivat Marketplace
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {LINKS.map(({ href, label, icon }) => (
          <Button
            key={href}
            variant={activeLink === href ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={href} className="flex w-full items-center">
              {icon && <span className="mr-2 text-xl">{icon}</span>}
              {label}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
