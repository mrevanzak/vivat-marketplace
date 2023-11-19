import React from "react";
import { Button, View } from "react-native-ui-lib";
import { useLocalSearchParams } from "expo-router";
import Input from "@/components/forms/Input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  proof: z.string(),
  bankName: z.string(),
  bankAccount: z.string(),
  bankHolder: z.string(),
});

export default function PaymentConfirmScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { mutate, isPending } = api.order.confirmPayment.useMutation();
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit((data) => {
    if (!orderId) return;

    mutate({
      ...data,
      orderId,
    });
  });

  return (
    <View bg-white br50 flex padding-s4 className="rounded-b-none">
      <FormProvider {...methods}>
        <Input
          id="bankName"
          label="Nama Bank"
          placeholder="Masukan nama bank"
        />
        <Input
          id="bankAccount"
          label="Nomor Rekening"
          placeholder="Masukan nomor rekening"
          inputMode="numeric"
        />
        <Input
          id="bankHolder"
          label="Nama Pemilik Rekening"
          placeholder="Masukan nama pemilik rekening"
        />
      </FormProvider>
      <Button
        label="Simpan"
        onPress={onSubmit}
        bg-primary
        br40
        disabled={isPending}
      />
    </View>
  );
}
