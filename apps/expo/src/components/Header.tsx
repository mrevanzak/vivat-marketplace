import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BorderRadiuses,
  Button,
  Spacings,
  TextField,
  View,
} from "react-native-ui-lib";
import { Link, usePathname } from "expo-router";
import { useSearchStore } from "@/lib/stores/useSearchStore";
import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

type HeaderProps = (BottomTabHeaderProps | NativeStackHeaderProps) & {
  hideSearch?: boolean;
};

export default function Header(props: HeaderProps) {
  const pathname = usePathname();
  const canGoBack = pathname !== "/home";

  const setSearch = useSearchStore((state) => state.setSearch);

  return (
    <SafeAreaView className="flex-row bg-[#157DC1]" {...props}>
      <View flex row padding-s4 className="space-x-2">
        {canGoBack && (
          <Button
            avoidInnerPadding
            onPress={() => props.navigation.goBack()}
            animateLayout
            bg-transparent
            centerH
            iconSource={() => (
              <MaterialIcons name="arrow-back-ios" size={24} color="white" />
            )}
          />
        )}
        {!props.hideSearch && (
          <Link href="/search" asChild disabled={canGoBack}>
            <Button
              avoidInnerPadding
              flex-1
              bg-transparent
              disabledBackgroundColor="transparent"
              animateLayout
            >
              <TextField
                placeholder="Search"
                containerStyle={{
                  backgroundColor: "white",
                  borderRadius: BorderRadiuses.br30,
                  flex: 1,
                }}
                fieldStyle={{
                  marginLeft: 10,
                }}
                readonly={!canGoBack}
                onChangeText={setSearch}
                maxLength={30}
              />
            </Button>
          </Link>
        )}
      </View>
    </SafeAreaView>
  );
}
