import React from "react";
import { Button } from "react-native-ui-lib";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#157DC1",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="home"
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
        options={{
          tabBarItemStyle: {
            top: -35,
            borderRadius: 120,
            backgroundColor: "white",
            aspectRatio: 1,
          },
          tabBarIconStyle: {
            left: 2,
          },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                focused ? "md-checkmark-circle-outline" : "md-checkmark-circle"
              }
              size={70}
              color="#FDBC12"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: (props) => (
            <Button avoidInnerPadding flex-1 {...props} />
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "md-person" : "md-person-outline"}
              size={32}
              color="white"
            />
          ),
        }}
      />
    </Tabs>
  );
}
