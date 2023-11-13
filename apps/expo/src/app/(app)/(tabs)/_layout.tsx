import React from "react";
import { Platform } from "react-native";
import { Button, Colors, Spacings } from "react-native-ui-lib";
import { Redirect, Tabs } from "expo-router";
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
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingVertical: Platform.OS === "ios" ? Spacings.s3 : 0,
          height: 70,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        // redirect={!isSignedIn}
        options={{
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
          tabBarItemStyle: {
            top: "-10%",
            borderRadius: 120,
            backgroundColor: Colors.white,
            aspectRatio: 1,
          },
          tabBarIconStyle: {
            left: 2,
          },
          tabBarIcon: ({ focused }) => (
            <Button
              avoidInnerPadding
              avoidMinWidth
              backgroundColor="transparent"
            >
              <Ionicons
                name={
                  focused
                    ? "md-checkmark-circle-outline"
                    : "md-checkmark-circle"
                }
                size={70}
                color={colors.secondary}
              />
            </Button>
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
