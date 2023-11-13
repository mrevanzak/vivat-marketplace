import { Button, View } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import Input from "@/components/forms/Input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";





const schema = z.object({
  title: z.string(),
  address: z.string(),
  zipCode: z.string().length(5),
  recipient: z.string(),
  phoneNumber: z.string(),
});

export default function CreateAddressScreen() {
  const router = useRouter();

  const utils = api.useUtils();
  const { mutate, isPending } = api.user.createAddress.useMutation();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.back();
        void utils.user.getAddresses.invalidate();
      },
    });
  });

  return (
    <View bg-white flex padding-s4>
      <FormProvider {...methods}>
        <Input id="title" label="Simpan sebagai" placeholder="Masukan judul" />
        <Input
          id="address"
          label="Alamat"
          autoComplete="street-address"
          multiline
        />
        <Input
          id="zipCode"
          label="Kode Pos"
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <Input id="recipient" label="Penerima" />
        <Input id="phoneNumber" label="Nomer Telepon" inputMode="tel" />
        <Button
          label="Simpan"
          onPress={onSubmit}
          bg-primary
          disabled={isPending}
          // iconSource={() => (
          //   <EvilIcons name="spinner-3" size={24} color="white" className="animate-spin" />
          // )}
        />
      </FormProvider>
    </View>
  );
}