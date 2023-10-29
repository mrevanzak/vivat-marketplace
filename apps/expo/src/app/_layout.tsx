import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "@/utils/api";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Slot />
      <StatusBar />
    </TRPCProvider>
  );
}
