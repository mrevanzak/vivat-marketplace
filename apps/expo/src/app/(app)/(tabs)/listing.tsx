import React, { useCallback, useEffect, useState } from "react";
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
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Input from "@/components/forms/Input";
import Picker from "@/components/forms/Picker";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import { storageClient, uploadOptions } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { UseTusResult } from "use-tus";
import { useTus } from "use-tus";
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
  const [image, setImage] = useState<ImagePicker.ImagePickerResult>();
  const [uploadProggres, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();

  const { data } = api.category.getCategories.useQuery({ partial: true });
  const { mutate } = api.product.addProduct.useMutation();
  const { setUpload }: UseTusResult = useTus({ autoStart: true });

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = methods;
  const onSubmit = handleSubmit(async (data) => {
    setIsUploading(true);
    const filePath = `${user?.id}/${data.name}.png`;

    const { error } = await onUpload(filePath);
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
          setImage(undefined);
          setIsUploading(false);
          router.push("/home");
        },
      },
    );
  });

  const onUpload = useCallback(
    (filePath: string) => {
      return new Promise<{ error?: Error }>((resolve) => {
        setUpload(image as unknown as Blob, {
          ...uploadOptions("products", filePath),
          onProgress(bytesSent, bytesTotal) {
            setUploadProgress((bytesSent / bytesTotal) * 100);
          },
          onSuccess() {
            resolve({ error: undefined });
          },
          onError(error) {
            setIsUploading(false);
            resolve({ error });
          },
        });
      });
    },
    [image, setUpload],
  );

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
    void async function checkPermission() {
      if (Constants.platform?.ios) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== ImagePicker.PermissionStatus.GRANTED ||
          cameraStatus.status !== ImagePicker.PermissionStatus.GRANTED
        ) {
          Alert.alert("Sorry, we need these permissions to make this work!");
        }
      }
    };
  }, []);

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
                  {isUploading && <AnimatedScanner progress={uploadProggres} />}
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
          disabled={isUploading}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
