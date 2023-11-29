import React from "react";
import { ActivityIndicator } from "react-native";
import {
  AnimatedImage,
  Avatar,
  BorderRadiuses,
  Card,
  Text,
  View,
} from "react-native-ui-lib";
import { Link, useLocalSearchParams } from "expo-router";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValues";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import rupiahFormatter from "@/utils/rupiahFormatter";
import { FlashList } from "@shopify/flash-list";

export default function SearchScreen() {
  const { categoryId, search, sellerId } = useLocalSearchParams<{
    categoryId: string;
    search: string;
    sellerId: string;
  }>();
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const { data, isFetching, refetch } = api.product.getProducts.useQuery({
    query: debouncedSearch ?? "",
    categoryId,
    sellerId,
  });

  return (
    <View bg-white br50 flex padding-s4 className="rounded-b-none">
      <Text primary text65>
        Produk
      </Text>
      <FlashList
        data={data}
        numColumns={2}
        estimatedItemSize={200}
        onRefresh={() => refetch()}
        refreshing={isFetching}
        ListEmptyComponent={
          <Text text70BO center marginT-s6>
            Produk tidak ditemukan
          </Text>
        }
        renderItem={({ item }) => {
          return (
            <Link
              asChild
              href={{
                pathname: "/(app)/product/[productId]",
                params: {
                  productId: item.id,
                },
              }}
            >
              <Card flex-1 margin-8 enableShadow borderRadius={BorderRadiuses.br60}>
                <AnimatedImage
                  source={{ uri: item.image }}
                  height={250}
                  borderRadius={BorderRadiuses.br60}
                  loader={
                    <ActivityIndicator
                      color={colors.secondary}
                      size="large"
                      className="mb-24"
                    />
                  }
                />
                <View
                  padding-s2
                  absH
                  bg-black
                  br50
                  className="bottom-0 opacity-70"
                >
                  <Text white>{item.name}</Text>
                  <Text white>{rupiahFormatter(item.price)}</Text>
                  {sellerId ? (
                    <Text
                      white
                      text90BO
                      marginT-s1
                      {...{ red10: !item.approved || item.stock === 0 }}
                    >
                      {item.stock === 0
                        ? "Stok habis"
                        : !item.approved
                        ? "Menunggu persetujuan"
                        : "Aktif"}
                    </Text>
                  ) : (
                    <View row right centerV>
                      <Avatar
                        source={{ uri: item.user.imageUrl }}
                        animate
                        useAutoColors
                        size={28}
                      />
                      <View padding-s2>
                        <Text text100 white>
                          {item.user.name}
                        </Text>
                        <Text text100 white className="text-right">
                          {item.user.major}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </Card>
            </Link>
          );
        }}
      />
    </View>
  );
}
