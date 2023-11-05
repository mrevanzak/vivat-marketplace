import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { colors } from "@/utils/constant";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <Header {...props} />,
        contentStyle: {
          flex: 1,
          backgroundColor: colors.primary,
        },
      }}
    />
  );
}
