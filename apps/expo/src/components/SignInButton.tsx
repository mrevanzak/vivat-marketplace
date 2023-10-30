import React from "react";
import { Button, View } from "react-native-ui-lib";
import { makeRedirectUri } from "expo-auth-session";
import { useWarmUpBrowser } from "@/lib/hooks/useWarmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";

export default function SignInButton() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: makeRedirectUri({
      scheme: "vivat.marketplace.app",
    }),
  });

  const handleSignInWithDiscordPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        void setActive?.({ session: createdSessionId });
      } else {
        // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
        throw new Error(
          "There are unmet requirements, modifiy this else to handle them",
        );
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  }, [startOAuthFlow]);

  return (
    <View flex centerH>
      <Button
        label="Login"
        size="medium"
        bg-primary
        className="w-1/2 p-3"
        onPress={handleSignInWithDiscordPress}
      />
    </View>
  );
}
