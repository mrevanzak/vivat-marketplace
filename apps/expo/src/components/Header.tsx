import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BorderRadiuses,
  Button,
  Spacings,
  TextField,
  View,
} from "react-native-ui-lib";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

type HeaderProps = (BottomTabHeaderProps | NativeStackHeaderProps) & {
  hideSearch?: boolean;
};

export default function Header(props: HeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-row bg-primary" {...props} edges={["top"]}>
      <View flex row padding-s4 className="space-x-2">
        {router.canGoBack() && (
          <Button
            avoidInnerPadding
            onPress={() => props.navigation.goBack()}
            bg-transparent
            centerH
            iconSource={() => (
              <MaterialIcons name="arrow-back-ios" size={24} color="white" />
            )}
          />
        )}
        {!props.hideSearch && (
          <Link href="/search" asChild disabled={router.canGoBack()}>
            <Button
              avoidInnerPadding
              flex-1
              bg-transparent
              disabledBackgroundColor="transparent"
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
                  marginVertical: Platform.OS === "ios" ? Spacings.s2 : 0,
                }}
                readonly={!router.canGoBack()}
                onChangeText={(text) => {
                  router.setParams({ search: text });
                }}
                maxLength={30}
              />
            </Button>
          </Link>
        )}
      </View>
    </SafeAreaView>
  );
}
