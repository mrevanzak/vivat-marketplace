import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link, Stack } from "expo-router";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

import colors from "@vivat/color-palette";

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
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
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
        name="product/[productId]"
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
        }}
      />
      <Stack.Screen
        name="payment-confirm"
        options={{
          headerTitle: "Konfirmasi Pembayaran",
        }}
      />
      <Stack.Screen
        name="product/edit"
        options={{
          headerTitle: "Ubah Detail Produk",
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
      <Stack.Screen
        name="order/[orderId]"
        options={{
          headerTitle: "Detail Pesanan",
        }}
      />
      <Stack.Screen
        name="order/confirm"
        options={{
          headerTitle: "Konfirmasi Pengiriman",
        }}
      />
    </Stack>
  );
}
