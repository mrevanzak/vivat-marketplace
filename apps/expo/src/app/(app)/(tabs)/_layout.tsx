import React from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Colors, Spacings } from "react-native-ui-lib";
import { Redirect, Tabs } from "expo-router";
import Header from "@/components/Header";
import colors from "@/utils/colors";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: Platform.OS === "ios" ? Spacings.s3 : 0,
        },
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        // redirect={!isSignedIn}
        options={{
          header: (props) => <Header {...props} />,
          tabBarButton: (props) => (
            <Button avoidInnerPadding flex-1 {...props} />
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "md-home" : "md-home-outline"}
              size={32}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="listing"
        // redirect={!isSignedIn}
        options={{
          headerTitle: "Tambah Produk",
          tabBarItemStyle: {
            bottom: 23,
            backgroundColor: Colors.white,
            alignSelf: "center",
            aspectRatio: 1,
            borderRadius: 50,
          },
          tabBarIconStyle: {
            left: 2,
            bottom: Platform.OS === "ios" ? 2 : 0,
          },
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity>
              <Ionicons
                name={
                  focused
                    ? "md-checkmark-circle-outline"
                    : "md-checkmark-circle"
                }
                size={70}
                color={colors.secondary}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        // redirect={!isSignedIn}
        options={{
          tabBarButton: (props) => (
            <Button avoidInnerPadding flex-1 {...props} />
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "md-person" : "md-person-outline"}
              size={32}
              color={Colors.white}
            />
          ),
        }}
      />
    </Tabs>
  );
}
