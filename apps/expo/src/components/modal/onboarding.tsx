import { useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Spacings, Text, View } from "react-native-ui-lib";
import { useFocusEffect } from "expo-router";
import { api } from "@/utils/api";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import { InputStyle } from "../forms/Input";

export default function OnboardingModal() {
  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [1, "45%"], []);

  const user = api.user.checkMajor.useQuery();
  const { mutate } = api.user.setMajor.useMutation();
  const utils = api.useUtils();

  const [major, setMajor] = useState("");

  useFocusEffect(() => {
    if (!user.data?.major) bottomSheetRef?.current?.expand();
    console.log(user.data?.major);
  });

  const onSubmit = () => {
    mutate(
      { major },
      {
        onSuccess: () => {
          utils.user.checkMajor.setData(undefined, { major });
          bottomSheetRef?.current?.close();
        },
      },
    );
  };

  return (
    <BottomSheet
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      bottomInset={safeBottomArea + Spacings.s4}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
      detached={true}
      style={{
        marginHorizontal: Spacings.s4,
      }}
      enablePanDownToClose
      keyboardBlurBehavior={"restore"}
      android_keyboardInputMode="adjustResize"
    >
      <View paddingH-s6 className="space-y-4">
        <Text text40>Selamat datang!</Text>
        <Text text70>
          Silahkan lengkapi profil anda dengan memilih jurusan yang anda ambil.
        </Text>
        <BottomSheetTextInput
          placeholder="Masukkan jurusan anda..."
          style={InputStyle}
          onChangeText={setMajor}
          value={major}
        />
        <Button bg-secondary primary label="Simpan" br40 onPress={onSubmit} />
      </View>
    </BottomSheet>
  );
}
