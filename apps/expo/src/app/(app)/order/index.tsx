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
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import rupiahFormatter from "@/utils/rupiahFormatter";
import { FlashList } from "@shopify/flash-list";

export default function OrdersScreen() {
  const { seller } = useLocalSearchParams();
  const { data, refetch, isFetching } = api.order.getOrders.useQuery({
    asSeller: seller ? true : false,
  });

  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu pembayaran";
      case "accepted":
        return "Diproses";
      case "cancelled":
        return "Dibatalkan";
      default:
        return "Menunggu konfirmasi";
    }
  };

  return (
    <View bg-white br50 flex padding-s4 className="rounded-b-none">
      <FlashList
        data={data}
        numColumns={1}
        estimatedItemSize={200}
        onRefresh={() => refetch()}
        refreshing={isFetching}
        ListEmptyComponent={
          <Text text70BO center marginT-s6>
            Tidak ada pembelian
          </Text>
        }
        renderItem={({ item }) => {
          return (
            <Link
              asChild
              href={{
                pathname: "/(app)/order/[orderId]",
                params: {
                  orderId: item.id,
                },
              }}
            >
              <Card
                padding-s4
                borderRadius={BorderRadiuses.br40}
                className="border-primary mb-4 space-y-4 border"
              >
                <View className="border-primary border-b pb-4">
                  <View row spread centerV>
                    <View row className="space-x-2">
                      <Avatar
                        source={{
                          uri: item.user?.imageUrl,
                        }}
                        animate
                        name={item.user?.name}
                        useAutoColors
                        size={36}
                      />
                      <View>
                        <Text text80>{item.user?.name}</Text>
                        <Text text90R>{item.user?.major}</Text>
                      </View>
                    </View>
                    <View
                      bg-secondary
                      {...{ "bg-red30": item.status === "cancelled" }}
                      padding-s1
                      br20
                    >
                      <Text text100BO white>
                        {getStatus(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View row centerV className="space-x-4">
                  <AnimatedImage
                    source={{ uri: item.products.image }}
                    height={100}
                    aspectRatio={1}
                    borderRadius={BorderRadiuses.br60}
                    loader={<ActivityIndicator color={colors.secondary} />}
                  />
                  <View>
                    <Text text70 primary>
                      {item.products.name}
                    </Text>
                    <Text text80 primary>
                      {rupiahFormatter(item.products.price)}
                    </Text>
                  </View>
                </View>
              </Card>
            </Link>
          );
        }}
      />
    </View>
  );
}
