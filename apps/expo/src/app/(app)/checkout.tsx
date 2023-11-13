import React from "react";
import {
  Button,
  Spacings,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Link, useLocalSearchParams } from "expo-router";
import Input from "@/components/forms/Input";
import RadioButton from "@/components/forms/RadioButton";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import rupiahFormatter from "@/utils/rupiahFormatter";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  note: z.string().optional(),
  courier: z.string(),
});

const ONGKIR = 40000;

export default function CheckoutScreen() {
  const { productId } = useLocalSearchParams();

  const { data: product } = api.product.showProduct.useQuery({
    id: productId as string,
  });
  const { data: address } = api.user.getDefaultAddress.useQuery();
  const { mutate, isPending } = api.order.checkout.useMutation();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit((data) => {
    if (!address || !product) return;
    mutate(
      {
        note: data.note,
        addressId: address.id,
        productId: productId as string,
        totalPrice: product.price + 10000,
        courier: data.courier,
      },
      {
        onSuccess: () => {
          console.log("success");
          // void utils.user.getAddresses.invalidate();
        },
      },
    );
  });

  return (
    <View bg-white br50 flex padding-s4 className="rounded-b-none">
      <Link href="/address/" asChild>
        <TouchableOpacity
          row
          spread
          paddingV-s2
          paddingH-s4
          br40
          className="border-primary mb-4 border"
        >
          <Text text70 primary>
            Alamat
          </Text>
          <View row>
            <Text className={address?.title ? "" : "text-red-400"} text70>
              {address?.title ?? "Select address"}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </Link>
      <FormProvider {...methods}>
        <Input
          id="note"
          label="Catatan"
          multiline
          placeholder="Masukan catatan"
        />
        <View
          paddingV-s2
          paddingH-s4
          br40
          className="border-primary mb-4 border"
        >
          <Text text80 primary marginB-s1>
            Kurir
          </Text>
          <RadioButton
            id="courier"
            options={["JNE", "TIKI", "SICEPAT"]}
            containerStyle={{
              paddingVertical: Spacings.s1,
            }}
            size={Spacings.s5}
          />
        </View>
      </FormProvider>
      <View paddingV-s2 paddingH-s4 br40 className="border-primary mb-4 border">
        <Text text80 primary marginB-s1>
          Rincian
        </Text>
        <View row spread>
          <Text text80>Subtotal</Text>
          <Text text80>{rupiahFormatter(product?.price)}</Text>
        </View>
        <View row spread>
          <Text text80>Ongkos Kirim</Text>
          <Text text80>{rupiahFormatter(ONGKIR)}</Text>
        </View>
        <View row spread>
          <Text text80>Total</Text>
          <Text text80>{rupiahFormatter(product?.price ?? 0 + ONGKIR)}</Text>
        </View>
      </View>
      <Button
        label="Beli"
        onPress={onSubmit}
        bg-primary
        br40
        disabled={isPending}
      />
    </View>
  );
}
