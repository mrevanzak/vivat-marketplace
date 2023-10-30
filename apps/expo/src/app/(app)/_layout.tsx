import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    />
  );
}
