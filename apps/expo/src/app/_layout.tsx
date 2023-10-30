import { useEffect } from "react";
import Constants from "expo-constants";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "@/utils/api";
import { tokenCache } from "@/utils/cache";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";

void SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      void SplashScreen.hideAsync()
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <SignedIn>
        <Slot />
      </SignedIn>
      <SignedOut>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SignedOut>
      <StatusBar />
    </TRPCProvider>
  );
}

export default function RootLayout() {
  const { CLERK_PUBLISHABLE_KEY } = Constants.expoConfig?.extra ?? {};

  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing CLERK_PUBLISHABLE_KEY environment variable. Please check your .env file.",
    );
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY as string}
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
}
