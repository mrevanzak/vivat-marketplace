import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image, View } from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import Logo from "~/full-logo.png"
import type { ImageSourcePropType } from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#157DC1", "#FFFFFF"]}
        locations={[0.17, 0.64]}
        className="flex-1"
      >
        <View flex center>
          <Image source={Logo as ImageSourcePropType} className="" />
        </View>
        <View flex centerH>
          <Link replace href="/(tabs)/home" asChild>
            <Button
              label="Login"
              size="medium"
              backgroundColor="#157DC1"
              className="w-1/2 p-3"
            />
          </Link>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
