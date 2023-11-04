import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextField } from "react-native-ui-lib";
import { Link, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useSearchStore } from "@/lib/stores/useSearchStore";

export default function Header(
  props: BottomTabHeaderProps | NativeStackHeaderProps,
) {
  const pathname = usePathname();
  const isSearchScreen = pathname === "/search";

  const setSearch = useSearchStore((state) => state.setSearch);

  return (
    <SafeAreaView className="flex-row bg-[#157DC1]" {...props}>
      {isSearchScreen && (
        <Link href="/(app)/(tabs)/home" asChild>
          <Button
            avoidInnerPadding
            animateLayout
            paddingL-s4
            bg-transparent
            centerH
            iconSource={() => (
              <MaterialIcons name="arrow-back-ios" size={24} color="white" />
            )}
          />
        </Link>
      )}
      <Link href="/search" asChild disabled={isSearchScreen}>
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
              marginHorizontal: 10,
              marginVertical: 20,
              height: 30,
              borderRadius: 8,
              flex: 1,
            }}
            fieldStyle={{
              marginLeft: 10,
            }}
            readonly={!isSearchScreen}
            onChangeText={setSearch}
            maxLength={30}
          />
        </Button>
      </Link>
    </SafeAreaView>
  );
}
