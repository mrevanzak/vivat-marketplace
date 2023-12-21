import React from "react";
import { ActivityIndicator } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AnimatedImage,
  Avatar,
  BorderRadiuses,
  Button,
  Spacings,
  Text,
  View,
} from "react-native-ui-lib";
import { Link, useLocalSearchParams } from "expo-router";
import { api } from "@/utils/api";
import rupiahFormatter from "@/utils/rupiahFormatter";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import colors from "@vivat/color-palette";

export default function ProductDetailScreen() {
  const { user } = useUser();
  const { productId } = useLocalSearchParams();

  const { data, isLoading, refetch } = api.product.showProduct.useQuery({
    id: productId as string,
  });

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />
      }
    >
      <AnimatedImage
        source={{ uri: data?.image }}
        height={280}
        style={{ borderRadius: BorderRadiuses.br60 }}
        containerStyle={{
          paddingHorizontal: Spacings.s4,
          paddingBottom: Spacings.s7,
          backgroundColor: colors.primary,
        }}
        loader={<ActivityIndicator color={colors.secondary} size="large" />}
      />
      <View bg-white br50 flex padding-s4 className="space-y-5 rounded-b-none">
        <View row spread>
          <View
            bg-primary
            br60
            padding-s2
            paddingL-s4
            centerV
            flex
            className="-ml-4 space-y-1 rounded-l-none"
          >
            <Text white text65>
              {data?.name}
            </Text>
            <Text text70 secondary>
              {data?.category.name}
            </Text>
          </View>
          <View padding-s4 centerV>
            <Text primary text60>
              {rupiahFormatter(data?.price)}
            </Text>
            <Text text70 className="text-right">
              Stok: {data?.stock}
            </Text>
          </View>
        </View>
        <View bg-black height={1} />
        <View row spread>
          <View row centerV>
            <Avatar
              source={{ uri: data?.seller.imageUrl }}
              animate
              useAutoColors
              size={42}
            />
            <View padding-s2>
              <Text text70>{data?.seller.name}</Text>
              <Text text90>{data?.seller.major}</Text>
            </View>
          </View>
          <View row centerV className="space-x-2">
            <Button
              bg-secondary
              round
              iconSource={() => (
                <MaterialIcons name="chat" size={20} color={colors.primary} />
              )}
            />
            <Button
              bg-secondary
              round
              iconSource={() => (
                <MaterialCommunityIcons
                  name="offer"
                  size={20}
                  color={colors.primary}
                />
              )}
            />
          </View>
        </View>
        <Text text70>{data?.description}</Text>
      </View>
      <SafeAreaView edges={["bottom"]}>
        <View bg-white>
          <View
            bg-primary
            row
            br50
            padding-s4
            spread
            className="space-x-4 rounded-b-none"
          >
            {user?.id === data?.seller.id ? (
              <Link
                href={{
                  pathname: "/product/edit",
                  params: { productId: data?.id ?? "" },
                }}
                asChild
              >
                <Button
                  bg-secondary
                  primary
                  label="Ubah Detail Produk"
                  br40
                  flex
                />
              </Link>
            ) : (
              <Link
                href={{
                  pathname: "/checkout",
                  params: { productId: data?.id ?? "" },
                }}
                asChild
              >
                <Button bg-secondary primary label="Beli" br40 flex />
              </Link>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
