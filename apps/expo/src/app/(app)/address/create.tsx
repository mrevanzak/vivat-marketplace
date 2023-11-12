import { Button, LoaderScreen, View } from "react-native-ui-lib";
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
  const { mutate, isPending } = api.user.createAddress.useMutation();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        void api.useUtils().user.getAddresses.invalidate();
        router.back();
      },
    });
  });

  if (isPending) return <LoaderScreen message="Loading..." />;

  return (
    <View bg-white flex padding-s4>
      <FormProvider {...methods}>
        <Input id="title" label="Save address as" />
        <Input
          id="address"
          label="Address"
          autoComplete="street-address"
          multiline
        />
        <Input
          id="zipCode"
          label="Zip Code"
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <Input id="recipient" label="Recipient" />
        <Input id="phoneNumber" label="Phone Number" inputMode="tel" />
        <Button
          label="Submit"
          onPress={onSubmit}
          bg-primary
          disabled={isPending}
        />
      </FormProvider>
    </View>
  );
}
