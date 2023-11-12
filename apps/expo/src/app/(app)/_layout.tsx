import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link, Stack } from "expo-router";
import Header from "@/components/Header";
import { colors } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          flex: 1,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          header: (props) => <Header {...props} />,
          contentStyle: {
            backgroundColor: colors.primary,
          },
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          header: (props) => <Header {...props} />,
          contentStyle: {
            backgroundColor: colors.primary,
          },
        }}
      />
      <Stack.Screen
        name="[productId]"
        options={{
          header: (props) => <Header {...props} hideSearch />,
          contentStyle: {
            backgroundColor: colors.primary,
          },
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerTitle: "Pengiriman",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="address/index"
        options={{
          headerTitle: "Alamat",
          headerTitleAlign: "center",
          headerRight: () => (
            <Link href="/address/create" asChild>
              <TouchableOpacity padding-s4>
                <Ionicons name="add" size={24} color={colors.primary} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="address/create"
        options={{
          headerTitle: "Buat Alamat",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
