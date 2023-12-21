import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";
import { Colors, LoaderScreen } from "react-native-ui-lib";
import Constants from "expo-constants";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "@/utils/api";
import { tokenCache } from "@/utils/cache";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { focusManager } from "@tanstack/react-query";

import colors from "@vivat/color-palette";

Colors.loadColors(colors);
void SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const { isLoaded } = useAuth();
  useEffect(() => {
    if (isLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoaderScreen loaderColor={colors.primary} />;
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
      <Toasts overrideDarkMode={true} />
    </ClerkProvider>
  );
}
