import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="(tabs)/home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          backgroundColor: "#157DC1",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 90,
        },
        // tabBarButton: (props) => <Button label={'Press'} size={Button.sizes.medium} backgroundColor={Colors.red30}/>
      }}
    />
  );
}
