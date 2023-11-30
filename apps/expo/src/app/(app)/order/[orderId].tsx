import React from "react";
import { Alert } from "react-native";
import {
  BorderRadiuses,
  Button,
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
  const { data: orders } = api.order.showOrder.useQuery({
    id: orderId as string,
  });
  const { data: log } = api.order.getLogOrders.useQuery({
    id: orderId as string,
  });

  const utils = api.useUtils();
  const confirmOrder = api.order.confirmOrder.useMutation();
  const onConfirmOrder = () => {
    confirmOrder.mutate(
      {
        id: orderId as string,
      },
      {
        onSuccess: () => void utils.order.invalidate(),
      },
    );
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pesanan dibuat";
      case "payment":
        return "Pembayaran berhasil";
      case "confirmed":
        return "Pesanan dikonfirmasi";
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
      <View
        paddingV-s2
        paddingH-s4
        br40
        className="border-primary mb-4 space-y-1 border"
      >
        <Text text80 primary marginB-s1>
          Catatan Pembelian
        </Text>
        {log?.map((item) => (
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
                  Alert.alert("Berhasil menyalin nomor rekening");
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
      {isSeller && orders?.status === "payment" && (
        <Button
          label="Terima pesanan"
          bg-secondary
          borderRadius={BorderRadiuses.br30}
          onPress={onConfirmOrder}
          labelStyle={{ marginLeft: Spacings.s1 }}
        />
      )}
      {isSeller && orders?.status === "confirmed" && (
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
              Unggah Bukti Pengiriman
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}
