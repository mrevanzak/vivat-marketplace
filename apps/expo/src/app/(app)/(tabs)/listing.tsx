import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  AnimatedImage,
  BorderRadiuses,
  Button,
  KeyboardAwareScrollView,
  Text,
  View,
} from "react-native-ui-lib";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Input from "@/components/forms/Input";
import Picker from "@/components/forms/Picker";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import { storageClient } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { decode } from "base64-arraybuffer";
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
  const [image, setImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const { data } = api.category.getCategories.useQuery({ partial: true });
  const { mutate } = api.product.addProduct.useMutation({});

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit(async (data) => {
    setUploading(true);
    const filePath = `${user?.id}/${data.name}.png`;

    await onUpload(filePath);
    const imgUrl = storageClient.from("products").getPublicUrl(filePath, {
      transform: {
        quality: 50,
      },
    });

    mutate(
      {
        ...data,
        image: imgUrl.data.publicUrl,
      },
      {
        onSuccess: () => {
          setUploading(false);
          router.push("/home");
        },
      },
    );
  });

  const onUpload = async (filePath: string) => {
    if (!image) return;
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });

    const { error } = await storageClient
      .from("products")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
      });
    if (error) {
      console.log(error);
      return;
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      setImage(result.assets[0]?.uri);
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
          alert("Sorry, we need these permissions to make this work!");
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
              {image ? (
                <>
                  <AnimatedImage
                    source={{ uri: image }}
                    style={{ width: 200, height: 200 }}
                    loader={
                      <ActivityIndicator
                        color={colors.secondary}
                        size="small"
                      />
                    }
                  />
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
          />
        </FormProvider>
        <Button
          label="Simpan"
          onPress={onSubmit}
          bg-primary
          br40
          disabled={uploading}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
