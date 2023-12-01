import { ActivityIndicator } from "react-native";
import {
  AnimatedImage,
  AnimatedScanner,
  BorderRadiuses,
  Button,
  KeyboardAwareScrollView,
  Text,
  View,
} from "react-native-ui-lib";
import { randomUUID } from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import Input from "@/components/forms/Input";
import Picker from "@/components/forms/Picker";
import { useSelectImage } from "@/lib/hooks/useSelectImage";
import { api } from "@/utils/api";
import colors from "@/utils/colors";
import { storageClient } from "@/utils/supabase";
import { toast } from "@backpackapp-io/react-native-toast";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().positive(),
  categoryId: z.string(),
});

interface ProductFormProps {
  edit?: boolean;
}

export default function ProductForm({ edit }: ProductFormProps) {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { userId } = useAuth();
  const utils = api.useUtils();

  const { data } = api.category.getCategories.useQuery({ partial: true });
  const productDetail = utils.product.showProduct.getData({
    id: productId as string,
  });
  const addProduct = api.product.addProduct.useMutation();
  const editProduct = api.product.editProduct.useMutation();

  const { image, onSelectImage, onUpload, uploadProggres } = useSelectImage();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: {
      name: productDetail?.name ?? "",
      description: productDetail?.description ?? "",
      price: productDetail?.price ?? 0,
      stock: productDetail?.stock ?? 0,
      categoryId: productDetail?.categoryId ?? "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });
  const { handleSubmit, reset } = methods;
  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Loading...");
    const productId = edit ? productDetail?.id : randomUUID();
    const filePath = `${userId}/${productId}.png`;

    const { error } = await onUpload("products", filePath);
    if (error && error.message !== "No image selected") {
      toast.error("Gagal mengupload gambar", { id: toastId });
      return;
    }

    const imgUrl = storageClient.from("products").getPublicUrl(filePath);
    edit
      ? editProduct.mutate(
          {
            ...data,
            image: imgUrl.data.publicUrl,
            id: productId!,
          },
          {
            onSuccess: () => {
              reset();
              router.back();
              toast.dismiss();
            },
          },
        )
      : addProduct.mutate(
          {
            ...data,
            image: imgUrl.data.publicUrl,
          },
          {
            onSuccess: () => {
              reset();
              toast.dismiss();
              router.push({
                pathname: "/search",
                params: { sellerId: userId ?? "" },
              });
            },
          },
        );
  });
  return (
    <KeyboardAwareScrollView paddingV-0>
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
            {productDetail?.image ?? image?.assets ? (
              <>
                <AnimatedImage
                  source={{
                    uri: image?.assets?.at(0)?.uri ?? productDetail?.image,
                  }}
                  style={{ width: 200, height: 200 }}
                  loader={
                    <ActivityIndicator color={colors.secondary} size="small" />
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
        disabled={
          !!uploadProggres || addProduct.isPending || editProduct.isPending
        }
      />
    </KeyboardAwareScrollView>
  );
}
