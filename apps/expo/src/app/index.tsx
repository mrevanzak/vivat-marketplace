import type { ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Image, View } from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import SignInButton from "@/components/SignInButton";
import { useAuth } from "@clerk/clerk-expo";

import colors from "@vivat/color-palette";

import Logo from "~/full-logo.png";

export default function WelcomeScreen() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={[colors.primary, Colors.white]}
        locations={[0.17, 0.64]}
        className="flex-1"
      >
        <View flex center>
          <Image source={Logo as ImageSourcePropType} />
        </View>
        <SignInButton />
      </LinearGradient>
    </SafeAreaView>
  );
}
