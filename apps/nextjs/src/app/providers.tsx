"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";

import colors from "@vivat/color-palette";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (env.VERCEL_URL) return env.VERCEL_URL; // SSR should use vercel url

  return `http://localhost:${env.PORT}`; // dev SSR should use localhost
};

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            const headers = new Map(props.headers);
            headers.set("x-trpc-source", "nextjs-react");
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: colors.primary,
            },
          }}
        >
          <ReactQueryStreamedHydration transformer={superjson}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {props.children}
              <Toaster />
            </ThemeProvider>
          </ReactQueryStreamedHydration>
          <ReactQueryDevtools initialIsOpen={false} />
        </ClerkProvider>
      </QueryClientProvider>
    </api.Provider>
  );
}
