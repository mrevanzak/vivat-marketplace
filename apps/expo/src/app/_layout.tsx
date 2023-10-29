import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import { TRPCProvider } from "@/utils/api";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar />
    </TRPCProvider>
  );
}
