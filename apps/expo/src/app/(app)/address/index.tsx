import React, { useRef } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Spacings, Text, View } from "react-native-ui-lib";
import { api } from "@/utils/api";

export default function AddressScreen() {
  const ref = useRef<Swipeable>(null);

  const utils = api.useUtils();
  const { data } = api.user.getAddresses.useQuery();
  const setDefaultAddress = api.user.setDefaultAddress.useMutation();
  const deleteAddress = api.user.deleteAddress.useMutation();

  const setDefaultAddressHandler = (id: string) => {
    ref.current?.close();
    setDefaultAddress.mutate(
      { id },
      {
        onSuccess: () => {
          void utils.user.invalidate();
        },
      },
    );
  };

  const removeAddressHandler = (id: string) => {
    ref.current?.close();
    deleteAddress.mutate(
      { id },
      {
        onSuccess: () => {
          void utils.user.getAddresses.invalidate();
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
          renderRightActions={() => (
            <Button
              label="Hapus"
              bg-red30
              br40
              marginR-s4
              marginL-0
              marginV-s2
              white
              onPress={() => removeAddressHandler(address.id)}
            />
          )}
          renderLeftActions={() => {
            return address.default ? null : (
              <Button
                label="Jadikan Alamat Utama"
                bg-secondary
                br40
                marginL-s4
                marginR-0
                marginV-s2
                primary
                onPress={() => setDefaultAddressHandler(address.id)}
              />
            );
          }}
          childrenContainerStyle={{
            paddingHorizontal: Spacings.s4,
            paddingVertical: Spacings.s2,
          }}
        >
          <View br40 className="border border-primary bg-white" padding-s4>
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
