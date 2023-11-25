import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import {
  AnimatedImage,
  AnimatedScanner,
  BorderRadiuses,
  Button,
  KeyboardAwareScrollView,
  Text,
  View,
} from "react-native-ui-lib";
import { useLocalSearchParams, useRouter } from "expo-router";
import Input from "@/components/forms/Input";
import { useSelectImage } from "@/lib/hooks/useSelectImage";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import { storageClient } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  bankName: z.string(),
  bankAccount: z.string(),
  bankHolder: z.string(),
});

export default function PaymentConfirmScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { image, onSelectImage, onUpload, uploadProggres } = useSelectImage();

  const { mutate, isPending } = api.order.confirmPayment.useMutation();
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit(async (data) => {
    if (!orderId) return;

    const filePath = `${user?.id}/${orderId}.png`;

    const { error } = await onUpload("payment_proof", filePath);
    if (error) {
      Alert.alert("Gagal mengupload gambar");
      return;
    }

    const imgUrl = storageClient.from("payment_proof").getPublicUrl(filePath);
    mutate(
      {
        ...data,
        orderId,
        proof: imgUrl.data.publicUrl,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  });

  return (
    <View bg-white br50 flex padding-s4 className="rounded-b-none">
      <KeyboardAwareScrollView>
        <FormProvider {...methods}>
          <View
            marginB-s4
            br40
            className="border-primary border bg-white"
            padding-s4
            flex
          >
            <Text text70 primary>
              Upload Bukti Pembayaran
            </Text>
            <View flex center paddingV-s6 className="space-y-2">
              {image?.assets ? (
                <>
                  <AnimatedImage
                    source={{ uri: image.assets[0]?.uri }}
                    style={{ width: 200, height: 200 }}
                    loader={
                      <ActivityIndicator
                        color={colors.secondary}
                        size="small"
                      />
                    }
                  />
                  {!!uploadProggres && (
                    <AnimatedScanner progress={uploadProggres} />
                  )}
                  <Button
                    onPress={onSelectImage}
                    label="Ganti Gambar"
                    bg-primary
                  />
                </>
              ) : (
                <Button
                  onPress={onSelectImage}
                  bg-primary
                  outline
                  outlineColor={colors.primary}
                  borderRadius={BorderRadiuses.br40}
                  padding-s2
                  iconSource={() => (
                    <MaterialCommunityIcons
                      name="file-image-plus"
                      size={40}
                      color={colors.primary}
                    />
                  )}
                />
              )}
            </View>
          </View>
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
          disabled={!!uploadProggres || isPending}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
