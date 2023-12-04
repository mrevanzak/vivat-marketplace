import React from "react";
import { Button, View } from "react-native-ui-lib";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/lib/hooks/useWarmUpBrowser";
import { toast } from "@backpackapp-io/react-native-toast";
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function SignInButton() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: makeRedirectUri({
      scheme: "vivat.marketplace.app",
      path: "/",
    }),
  });

  const handleSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        void setActive?.({ session: createdSessionId });
      } else {
        throw new Error(
          "There are unmet requirements, modifiy this else to handle them",
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Error signing in: " + err.message);
      }
    }
  }, [startOAuthFlow]);

  return (
    <View flex centerH>
      <Button
        label="Login"
        size="medium"
        bg-primary
        className="w-1/2 p-3"
        onPress={handleSignIn}
      />
    </View>
  );
}
