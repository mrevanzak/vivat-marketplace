import React, { useRef } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Spacings, Text, View } from "react-native-ui-lib";
import { api } from "@/utils/api";

export default function AddressScreen() {
  const ref = useRef<Swipeable>(null);

  const { data } = api.user.getAddresses.useQuery();
  const { mutate } = api.user.setDefaultAddress.useMutation();

  const setDefaultAddress = (id: string) => {
    console.log(id);
    mutate(
      { id },
      {
        onSuccess: () => {
          void api.useUtils().user.invalidate();
          ref.current?.close();
        },
      },
    );
  };

  return (
    <View bg-white flex>
      {data?.map((address) => (
        <Swipeable
          key={address.id}
          ref={ref}
          renderLeftActions={() => (
            <Button
              label="Jadikan Alamat Utama"
              bg-secondary
              br40
              padding-s4
              margin-s4
              marginR-0
              primary
              onPress={() => setDefaultAddress(address.id)}
            />
          )}
          childrenContainerStyle={{ padding: Spacings.s4 }}
        >
          <View br40 className="border-primary border bg-white" padding-s4>
            <View row className="space-x-1">
              <Text text65 primary className="font-bold">
                {address.title}
              </Text>
              {address.default && (
                <Text text65 primary className="font-bold">
                  (Alamat Utama)
                </Text>
              )}
            </View>
            <Text text70>{address.recipient}</Text>
            <Text text70>{address.phoneNumber}</Text>
            <Text text70 marginT-s2>
              {address.address}
            </Text>
          </View>
        </Swipeable>
      ))}
    </View>
  );
}
