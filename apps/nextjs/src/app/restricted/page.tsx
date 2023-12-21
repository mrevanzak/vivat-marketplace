import * as React from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { RiAlarmWarningFill } from "react-icons/ri";

export const metadata: Metadata = {
  title: "Not Authorized",
};

export default function NotAuthorized() {
  return (
    <main>
      <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-white">
        <RiAlarmWarningFill
          size={60}
          className="drop-shadow-glow animate-flicker text-red-500"
        />
        <h1 className="mt-8 text-4xl md:text-6xl">Not Authorized</h1>
        <p className="mt-4 text-xl">
          You need admin privileges to access this page.
        </p>
        <SignOutButton>
          <Button className="mt-8">Sign Out</Button>
        </SignOutButton>
      </div>
    </main>
  );
}
