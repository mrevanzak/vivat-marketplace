import React from "react";
import { ActivityIndicator } from "react-native";
import {
  AnimatedImage,
  BorderRadiuses,
  Button,
  Colors,
  Spacings,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import * as Clipboard from "expo-clipboard";
import { Link, useLocalSearchParams } from "expo-router";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import rupiahFormatter from "@/utils/rupiahFormatter";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import "moment/locale/id";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "@backpackapp-io/react-native-toast";
import type { z } from "zod";

import type { schema } from "@vivat/db";

const BANK_ACCOUNT = [
  {
    name: "BNI",
    number: "12345678910",
  },
  {
    name: "BCA",
    number: "12345678910",
  },
  {
    name: "MANDIRI",
    number: "12345678910",
  },
  {
    name: "BRI",
    number: "12345678910",
  },
];

export default function OrderDetailScreen() {
  const { orderId, isSeller } = useLocalSearchParams();
  const {
    data: orders,
    isLoading,
    refetch,
  } = api.order.showOrder.useQuery({
    id: orderId as string,
  });

  const utils = api.useUtils();
  const confirmOrder = api.order.confirmOrder.useMutation({
    onSuccess: () => void utils.order.invalidate(),
  });

  const getStatus = (status: z.infer<typeof schema.orderStatusEnum>) => {
    switch (status) {
      case "pending":
        return "Pesanan dibuat";
      case "payment":
        return "Pembayaran berhasil";
      case "verified":
        return "Pembayaran diverifikasi";
      case "confirmed":
        return "Pesanan dikonfirmasi";
      case "shipped":
        return "Pesanan dikirim";
      case "done":
        return "Pesanan selesai";
      case "cancelled":
        return "Dibatalkan";
    }
  };

  const renderSellerAction = () => {
    if (orders?.status === "verified") {
      return (
        <View className="space-y-4">
          <Button
            label="Tolak pesanan"
            bg-red20
            outline
            outlineColor={Colors.red20}
            borderRadius={BorderRadiuses.br30}
            onPress={() =>
              confirmOrder.mutate({
                id: orderId as string,
                status: "cancelled",
              })
            }
          />
          <Button
            label="Terima pesanan"
            bg-secondary
            primary
            borderRadius={BorderRadiuses.br30}
            onPress={() =>
              confirmOrder.mutate({
                id: orderId as string,
                status: "confirmed",
              })
            }
          />
        </View>
      );
    }
    if (orders?.status === "confirmed") {
      return (
        <Link
          href={{
            pathname: "/order/confirm",
            params: { orderId: orderId as string },
          }}
          asChild
        >
          <TouchableOpacity
            row
            spread
            paddingV-s2
            paddingH-s4
            br40
            className="border-primary mb-4 border"
          >
            <Text text70 primary>
              Unggah Bukti Pengiriman
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </Link>
      );
    }
    return null;
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
      }}
      contentContainerStyle={{
        padding: Spacings.s4,
      }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />
      }
    >
      <SafeAreaView edges={["bottom"]}>
        <View
          paddingV-s2
          paddingH-s4
          br40
          className="border-primary mb-4 space-y-1 border"
        >
          <Text text80 primary marginB-s1>
            Catatan Pembelian
          </Text>
          {orders?.logOrders?.map((item) => (
            <View key={item.id} row spread>
              <View>
                <Text primary text90R>
                  {moment(item.timestamp).format("HH:mm")}
                </Text>
                <Text primary text90R>
                  {moment(item.timestamp).locale("id").format("dddd, LL")}
                </Text>
              </View>
              <Text primary text90R>
                {getStatus(item.status)}
              </Text>
            </View>
          ))}
        </View>
        <View
          paddingV-s2
          paddingH-s4
          br40
          className="border-primary mb-4 space-y-1 border"
        >
          <Text text80 primary marginB-s1>
            Rincian Pembelian
          </Text>
          <Text text70BO primary>
            {orders?.product.name}
          </Text>
          <Text primary>
            Penerima:{" "}
            <Text>
              {orders?.address.recipient} - {orders?.address.phoneNumber}
            </Text>
          </Text>
          <Text primary>
            Alamat:{" "}
            <Text>
              {orders?.address.address} - {orders?.address.zipCode}
            </Text>
          </Text>
          <Text primary>
            Catatan: <Text>{orders?.note ?? "-"}</Text>
          </Text>
          <Text primary>
            Kurir: <Text>{orders?.courier}</Text>
          </Text>
          <View row spread center>
            <Text primary>TOTAL:</Text>
            <View flex height={1} bg-black marginH-s2></View>
            <Text primary text70BO>
              {rupiahFormatter(orders?.totalPrice)}
            </Text>
          </View>
        </View>
        {orders?.status === "pending" && (
          <>
            <View
              paddingV-s2
              paddingH-s4
              br40
              className="border-primary mb-4 space-y-1 border"
            >
              <Text text80 primary marginB-s1>
                Transfer ke Vivat Marketplace
              </Text>
              {BANK_ACCOUNT.map((bank) => (
                <Text
                  key={bank.name}
                  onPress={async () => {
                    await Clipboard.setStringAsync(bank.number);
                    toast.success("Berhasil menyalin nomor rekening");
                  }}
                >
                  {bank.name}: {bank.number} - Vivat Marketplace
                </Text>
              ))}
            </View>
            <Link
              href={{
                pathname: "/payment-confirm",
                params: { orderId: orderId as string },
              }}
              asChild
            >
              <TouchableOpacity
                row
                spread
                paddingV-s2
                paddingH-s4
                br40
                className="border-primary mb-4 border"
              >
                <Text text70 primary>
                  Unggah Bukti Pembayaran
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </Link>
          </>
        )}
        {orders?.status === "shipped" && (
          <View
            paddingV-s2
            paddingH-s4
            br40
            className="border-primary mb-4 space-y-1 border"
          >
            <Text text80 primary marginB-s1>
              Nomer Resi Pengiriman
            </Text>
            <Text
              primary
              onPress={async () => {
                orders.shipping &&
                  (await Clipboard.setStringAsync(orders.shipping?.courier));
                toast.success("Berhasil menyalin nomor resi");
              }}
            >
              {orders?.shipping?.courier}:{" "}
              <Text>{orders?.shipping?.trackingNumber}</Text>
            </Text>
            <AnimatedImage
              containerStyle={{ alignItems: "center" }}
              source={{ uri: orders?.shipping?.proof }}
              style={{ width: 200, height: 200 }}
              loader={
                <ActivityIndicator color={colors.secondary} size="small" />
              }
            />
          </View>
        )}
        {orders?.status === "shipped" && (
          <Button
            label="Konfirmasi pesanan diterima"
            bg-secondary
            primary
            borderRadius={BorderRadiuses.br30}
            onPress={() =>
              confirmOrder.mutate({
                id: orderId as string,
                status: "done",
              })
            }
          />
        )}
        {isSeller && !!+isSeller && renderSellerAction()}
      </SafeAreaView>
    </ScrollView>
  );
}
