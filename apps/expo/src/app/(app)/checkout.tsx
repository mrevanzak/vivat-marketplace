import React from "react";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Link } from "expo-router";
import { api } from "@/utils/api";
import { colors } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

export default function CheckoutScreen() {
  const { data } = api.user.getDefaultAddress.useQuery();

  return (
    <View bg-white br50 flex padding-s4 className="rounded-b-none">
      <Link href="/address/" asChild>
        <TouchableOpacity row spread paddingV-s2 className="border-b">
          <Text text70 primary>
            Alamat
          </Text>
          <View row>
            <Text className={data?.title ? "" : "text-gray-400"} text70>
              {data?.title ?? "Select address"}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
