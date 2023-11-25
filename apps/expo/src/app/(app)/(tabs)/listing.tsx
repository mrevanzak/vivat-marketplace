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
import { useRouter } from "expo-router";
import Input from "@/components/forms/Input";
import Picker from "@/components/forms/Picker";
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
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  categoryId: z.string(),
});

export default function UploadProductScreen() {
  const router = useRouter();
  const { user } = useUser();

  const { data } = api.category.getCategories.useQuery({ partial: true });
  const { mutate, isPending } = api.product.addProduct.useMutation();

  const { image, onSelectImage, onUpload, uploadProggres } = useSelectImage();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = methods;
  const onSubmit = handleSubmit(async (data) => {
    const filePath = `${user?.id}/${data.name}.png`;

    const { error } = await onUpload("products", filePath);
    if (error) {
      Alert.alert("Gagal mengupload gambar");
      return;
    }

    const imgUrl = storageClient.from("products").getPublicUrl(filePath);
    mutate(
      {
        ...data,
        image: imgUrl.data.publicUrl,
      },
      {
        onSuccess: () => {
          reset();
          router.push("/home");
        },
      },
    );
  });

  return (
    <View bg-white padding-s4 flex>
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
              Upload Gambar
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
            id="name"
            label="Nama Produk"
            placeholder="Masukan nama produk"
          />
          <Input
            id="description"
            label="Deskripsi Produk"
            multiline
            placeholder="Masukan deskripsi produk"
          />
          <Input
            id="price"
            label="Harga Produk"
            placeholder="Masukan harga produk"
            inputMode="numeric"
          />
          <Input
            id="stock"
            label="Stok Produk"
            placeholder="Masukan stok produk"
            inputMode="numeric"
          />
          <Picker
            id="categoryId"
            label="Kategori Produk"
            placeholder="Pilih kategori produk"
            topBarProps={{ title: "Kategori" }}
            items={
              data?.map((category) => ({
                label: category.name,
                value: category.id,
              })) ?? [{ label: "Loading...", value: "loading" }]
            }
            useSafeArea
          />
        </FormProvider>
        <Button
          label="Simpan"
          onPress={onSubmit}
          bg-primary
          br40
          disabled={!!uploadProggres ?? isPending}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
