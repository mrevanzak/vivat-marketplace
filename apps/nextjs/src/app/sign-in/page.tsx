import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function AuthenticationPage() {
  return (
    <div className="container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          Vivat Marketplace
        </div>
        <Image
          src="/ITS.png"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 mt-auto">
          <p className="text-lg">Hidup ITS! Hidup ITS! Hidup ITS!</p>
        </div>
      </div>
      <div className="lg:p-8">
        <SignIn />
      </div>
    </div>
  );
}
